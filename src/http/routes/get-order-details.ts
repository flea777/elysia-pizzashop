import Elysia from 'elysia'
import { auth } from '../plugins/auth'
import { GetOrderDetailsDtoSchema } from '../dtos/get-order-details-params.dto'
import { UnauthorizedError } from '../errors/unauthorized-error'
import { db } from '../../db/connection'

export const getOrderDetails = new Elysia()
  .use(auth)
  .get('/orders/:id', async ({ getCurrentUser, params, set }) => {
    try {
    const { id: orderId } = params
    const { restaurantId } = await getCurrentUser()

    if (!restaurantId) {
      throw new UnauthorizedError()
    }

    const order = await db.query.orders.findFirst({
      columns: {
        id: true,
        status: true,
        totalInCents: true,
        createdAt: true,
      },
      with: {
        customer: {
          columns: {
            name: true,
            phone: true,
            email: true,
          }
        },
        ordersItems: {
          columns: {
            id: true,
            priceInCents: true,
            quantity: true
          },
          with: {
            product: {
              columns: {
                name: true,
              }
            },
          }
        },
      },
      where(fields, { eq }) {
        return eq(fields.id, orderId)
      },
    })

    if (!order) {
      set.status = 404

      return { message: 'Order not found' }
    }

    return order
  } catch(err) {
    console.log(err)
    console.error(`Erro: ${err}`)
  }
  }, {
    params: GetOrderDetailsDtoSchema
  })
