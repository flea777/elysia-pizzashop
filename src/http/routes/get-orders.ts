import Elysia from 'elysia'
import { auth } from '../plugins/auth'
import { UnauthorizedError } from '../errors/unauthorized-error'
import { OrderQueryParamDtoSchema } from '../dtos/order-query-param.dto'
import { orders, users } from '../../db/schema'
import {
  and,
  count,
  desc,
  eq,
  fillPlaceholders,
  getTableColumns,
  ilike,
  sql,
} from 'drizzle-orm'
import { db } from '../../db/connection'

export const getOrders = new Elysia().use(auth).get(
  '/orders',
  async ({ getCurrentUser, query }) => {
    const { restaurantId } = await getCurrentUser()
    const { customerName, orderId, status, pageIndex } = query

    if (!restaurantId) {
      throw new UnauthorizedError()
    }

    const orderTableColumns = getTableColumns(orders)

    const baseQuery = db
      .select({
        orderId: orders.id,
        createdAt: orders.createdAt,
        status: orders.status,
        total: orders.totalInCents,
        customerName: users.name,
      })
      .from(orders)
      .innerJoin(users, eq(users.id, orders.customerId))
      .where(
        and(
          eq(orders.restaurantId, restaurantId),
          orderId ? ilike(orders.id, `%${orderId}%`) : undefined,
          status ? eq(orders.id, status) : undefined,
          customerName ? ilike(users.name, `%${customerName}%`) : undefined
        )
      )

    const [amountOfOrdersQuery, allOrders] = await Promise.all([
      db.select({ count: count() }).from(baseQuery.as('baseQuery')),
      db
        .select()
        .from(baseQuery.as('baseQuery'))
        .offset(pageIndex * 10)
        .limit(10)
        .orderBy((fields) => {
          {
            return [
              sql`CASE ${fields.status}
                WHEN 'pending' THEN 1
                WHEN 'processing' THEN 2
                WHEN 'delivering' THEN 3
                WHEN 'delivered' THEN 4
                WHEN 'canceled' THEN 99
              END`,
              desc(fields.createdAt),
            ]
          }
        }),
    ])

    const amountOfOrders = amountOfOrdersQuery[0]?.count ?? 0

    return {
      orders: allOrders,
      meta: {
        pageIndex,
        perPage: 10,
        totalCount: amountOfOrders,
      },
    }
  },
  {
    query: OrderQueryParamDtoSchema,
  }
)
