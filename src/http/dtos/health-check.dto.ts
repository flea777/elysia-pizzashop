import { t, type Static } from 'elysia'

export const HealthCheckDtoSchema = t.Object({
  status: t.String(),
  message: t.String(),
  timestamp: t.Number(),
})

export type HealthCheckDto = Static<typeof HealthCheckDtoSchema>
