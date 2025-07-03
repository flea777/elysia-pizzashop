import { Elysia } from 'elysia'
import { healthCheck } from './routes/health-check'
import { registerRestaurant } from './routes/register-restaurant'
import { sendAuthLink } from './routes/send-auth-link'
import { authenticateFromLink } from './routes/authenticate-from-link'
import { getProfile } from './routes/get-profile'
import { getManagedRestaurant } from './routes/get-managed-restaurant'
import swagger from '@elysiajs/swagger'
import chalk from 'chalk'
import { errorHandler } from './plugins/error-handler'

const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: 'PizzaShop Documentation',
          version: '1.0.0',
        },
      },
    })
  )
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
