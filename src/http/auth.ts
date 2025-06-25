import jwt from '@elysiajs/jwt'
import Elysia from 'elysia'
import { env } from '../env'
import { JwtPayloadDtoSchema, type JwtPayloadDto } from './dtos/jwt-payload.dto'

export const auth = new Elysia().use(
  jwt({
    secret: env.JWT_SECRET_KEY,
    schema: JwtPayloadDtoSchema,
  })
).derive({ as: 'scoped' }, ({ jwt, cookie: { auth } }) => {
  return {
    signInUser: async (payload: JwtPayloadDto) => {
      const token = await jwt.sign(payload)

      if (auth) {
        auth.value = token
        auth.httpOnly = true
        auth.maxAge = 60 * 60 * 24 * 7 // 7 days
        auth.path = '/'
      }

    },

    signOutUser: () => {
      auth?.remove()
    },

    getCurrentUser: async () => {
      if (!auth) {
        throw new Error('Auth not found')
      }

      const payload = await jwt.verify(auth.value)

      if (!payload) {
        throw new Error('Unauthorized')
      }

      return {
        userId: payload.sub,
        restaurantId: payload.restaurantId
      }
    }

  }

})
