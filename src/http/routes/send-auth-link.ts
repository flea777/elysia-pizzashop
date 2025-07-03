import { SendAuthLinkDtoSchema } from '../dtos/send-auth-link.dto'
import { db } from '../../db/connection'
import { authLinks } from '../../db/schema'
import { env } from '../../util/env'
import chalk from 'chalk'
import Elysia from 'elysia'
import { mail } from '../../lib/mail'

export const sendAuthLink = new Elysia().post(
  '/authenticate',
  async ({ body }) => {
    const { email } = body

    const userFromEmail = await db.query.users.findFirst({
      where(fields, { eq }) {
        return eq(fields.email, email)
      },
    })

    if (!userFromEmail) {
      throw new Error('User not found')
    }

    const [createdAuthLink] = await db
      .insert(authLinks)
      .values({
        userId: userFromEmail.id,
      })
      .returning({
        code: authLinks.code,
      })

    if (!createdAuthLink) {
      throw new Error('Unexpected error')
    }

    const { code } = createdAuthLink
    const authLink = new URL('/auth-links/authenticate', env.API_BASE_URL)

    authLink.searchParams.set('code', code)
    authLink.searchParams.set('redirect', env.AUTH_REDIRECT_URL)

    console.log(`Generated URL: ${chalk.blueBright(authLink.toString())}`)

    await mail.sendMail({
      from: {
        name: 'Pizza Shop',
        address: 'hi@pizzashop.com'
      },
      to: email,
      subject: 'Authenticate to Pizza Shop',
      text: `Use the following link to authenticate on pizza shop :  ${authLink.toString()}`
    })
  },
  {
    body: SendAuthLinkDtoSchema,
  }
)
