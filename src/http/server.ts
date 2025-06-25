import { Elysia } from 'elysia'
import { healthCheck } from './routes/health-check'
import { registerRestaurant } from './routes/register-restaurant'
import { sendAuthLink } from './routes/send-auth-link'
import { authenticateFromLink } from './routes/authenticate-from-link'

const app = new Elysia()
  .use(healthCheck)
  .use(registerRestaurant)
  .use(sendAuthLink)
  .use(authenticateFromLink)
  .listen(3333, () => {
    console.log('Http server running!')
  })
