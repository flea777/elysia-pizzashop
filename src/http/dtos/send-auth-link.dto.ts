import { t, type Static } from 'elysia'

export const SendAuthLinkDtoSchema = t.Object({
  email: t.String({ format: 'email' }),
})

export type SendAuthLinkDto = Static<typeof SendAuthLinkDtoSchema>
