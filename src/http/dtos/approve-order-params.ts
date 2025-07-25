import { t, type Static } from 'elysia'

export const ApproveOrderDtoSchema = t.Object({
  orderId: t.String({
    format: 'uuid',
    error: 'The param must be a valid UUID',
  }),
})

export type ApproveOrderDto = Static<typeof ApproveOrderDtoSchema>
