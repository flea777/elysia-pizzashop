import { Elysia, t } from 'elysia'
import { healthCheck } from './routes/health-check'
import { registerRestaurant } from './routes/register-restaurant'
import { sendAuthLink } from './routes/send-auth-link'
import jwt from '@elysiajs/jwt'
import { env } from '../env'
import { JwtPayloadDtoSchema } from './dtos/jwt-payload.dto'
import cookie from '@elysiajs/cookie'

const app = new Elysia()
  .use(jwt({
    secret: env.JWT_SECRET_KEY,
    schema: JwtPayloadDtoSchema
  }))
  .use(cookie())
  .use(healthCheck)
  .use(registerRestaurant)
  .use(sendAuthLink)

app.listen(3333, () => {
  console.log('Http server running!')
})
