import { t, type Static } from 'elysia'

export const UpdateOrderDtoSchema = t.Object({
  orderId: t.String({
    format: 'uuid',
    error: 'The param must be a valid UUID',
  }),
})

export type UpdateOrderDto = Static<typeof UpdateOrderDtoSchema>
