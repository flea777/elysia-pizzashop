import { t, type Static } from 'elysia'

export const JwtPayloadDtoSchema = t.Object({
  sub: t.String(),
  restaurantId: t.Optional(t.String())
})

export type JwtPayloadDto = Static<typeof JwtPayloadDtoSchema>
