import { t, type Static } from 'elysia'

export const GetDailyRevenueDtoSchema = t.Object({
  from: t.Optional(t.String()),
  to: t.Optional(t.String())
})

export type GetDailyRevenueDto = Static<typeof GetDailyRevenueDtoSchema>
