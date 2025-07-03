import Elysia from 'elysia'
import { AuthQueryParamDtoSchema } from '../dtos/auth-query-param.dto'
import { db } from '../../db/connection'
import dayjs from 'dayjs'
import { authLinks } from '../../db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '../plugins/auth'
import { AuthLinkNotFoundError } from '../errors/auth-link-not-found-error'
import { AuthLinkExpiredError } from '../errors/auth-link-expired-error'

export const authenticateFromLink = new Elysia()
  .error({
    AUTH_LINK_NOT_FOUND: AuthLinkNotFoundError,
    AUTH_LINK_EXPIRED: AuthLinkExpiredError,
  })
  .onError(({ error, code, set }) => {
    switch (code) {
      case 'AUTH_LINK_NOT_FOUND': {
        set.status = 401
        return { code, message: error.message }
      }
    }
  })
  .use(auth)
  .get(
    '/auth-links/authenticate',
    async ({ query, redirect, signInUser }) => {
      const { code, redirect: redirectUrl } = query

      const authLinkFromCode = await db.query.authLinks.findFirst({
        where(fields, { eq }) {
          return eq(fields.code, code)
        },
      })

      if (!authLinkFromCode) {
        throw new AuthLinkNotFoundError()
      }

      const daysSinceAuthLinkWasCreated = dayjs().diff(
        authLinkFromCode.createdAt,
        'days'
      )

      if (daysSinceAuthLinkWasCreated > 7) {
        throw new AuthLinkExpiredError()
      }

      const managedRestaurant = await db.query.restaurants.findFirst({
        where(fields, { eq }) {
          return eq(fields.managerId, authLinkFromCode.userId)
        },
      })

      await signInUser({
        sub: authLinkFromCode.userId,
        restaurantId: managedRestaurant?.id,
      })

      await db.delete(authLinks).where(eq(authLinks.code, code))

      return redirect(redirectUrl)
    },
    {
      query: AuthQueryParamDtoSchema,
    }
  )
