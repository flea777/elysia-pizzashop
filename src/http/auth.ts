import jwt from '@elysiajs/jwt'
import Elysia from 'elysia'
import { env } from '../env'
import { JwtPayloadDtoSchema } from './dtos/jwt-payload.dto'

export const auth = new Elysia().use(
  jwt({
    secret: env.JWT_SECRET_KEY,
    schema: JwtPayloadDtoSchema,
  })
)
