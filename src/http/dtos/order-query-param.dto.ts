import { t, type Static } from 'elysia'
import { createSelectSchema } from 'drizzle-typebox'
import { orders } from '../../db/schema'

export const OrderQueryParamDtoSchema = t.Object({
  customerName: t.Optional(t.String()),
  orderId: t.Optional(t.String({
    format: 'uuid'
  })),
  status: t.Optional(createSelectSchema(orders).properties.status),
  pageIndex: t.Numeric({ minimum: 0 }),
})

export type OrderQueryParamDto = Static<typeof OrderQueryParamDtoSchema>
