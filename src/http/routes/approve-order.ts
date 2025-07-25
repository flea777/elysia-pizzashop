import Elysia from 'elysia'
import { auth } from '../plugins/auth'
import { UpdateOrderDtoSchema } from '../dtos/update-order-params'
import { UnauthorizedError } from '../errors/unauthorized-error'
import { db } from '../../db/connection'
import { orders } from '../../db/schema'
import { eq } from 'drizzle-orm'

export const approveOrder = new Elysia().use(auth).patch(
  '/orders/:orderId/approve',
  async ({ getCurrentUser, set, params }) => {
    const { orderId } = params
    const { restaurantId } = await getCurrentUser()

    if (!restaurantId) {
      throw new UnauthorizedError()
    }

    const order = await db.query.orders.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, orderId)
      },
    })

    if (!order) {
      set.status = 404

      return { message: 'Order not found!' }
    }

    if (order.status !== 'pending') {
      set.status = 409

      return {
        message: `Cannot approve order. Current status is '${order.status}`,
      }
    }

    await db
      .update(orders)
      .set({ status: 'processing' })
      .where(eq(orders.id, orderId))
  },
  {
    params: UpdateOrderDtoSchema,
  }
)
