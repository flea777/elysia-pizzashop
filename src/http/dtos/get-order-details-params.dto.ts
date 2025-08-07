import { t, type Static } from 'elysia'

export const GetOrderDetailsDtoSchema = t.Object({
  id: t.String({
    format: 'uuid',
    error: 'The param must be a valid UUID',
  }),
})

export type GetOrderDetailsDto = Static<typeof GetOrderDetailsDtoSchema>
