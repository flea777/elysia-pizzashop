import { t, type Static } from 'elysia'

export const AuthQueryParamDtoSchema = t.Object({
  code: t.String(),
  redirect: t.String(),
})

export type AuthQueryParamDto = Static<typeof AuthQueryParamDtoSchema>
