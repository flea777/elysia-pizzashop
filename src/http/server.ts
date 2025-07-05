import { Elysia } from 'elysia'
import { healthCheck } from './routes/health-check'
import { registerRestaurant } from './routes/register-restaurant'
import { sendAuthLink } from './routes/send-auth-link'
import { authenticateFromLink } from './routes/authenticate-from-link'
import { getProfile } from './routes/get-profile'
import { getManagedRestaurant } from './routes/get-managed-restaurant'
import { errorHandler } from './plugins/error-handler'
import { swaggerPlugin } from './plugins/swagger'

new Elysia()
  .use(swaggerPlugin)
  .use(errorHandler)
  .use(healthCheck)
  .use(registerRestaurant)
  .use(sendAuthLink)
  .use(authenticateFromLink)
  .use(getProfile)
  .use(getManagedRestaurant)
  .listen(3333, () => {
    console.log('Http server running!')
  })
