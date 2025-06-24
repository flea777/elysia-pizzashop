import { Elysia, t } from 'elysia'
import { healthCheck } from './routes/health-check'
import { registerRestaurant } from './routes/register-restaurant'
import { sendAuthLink } from './routes/send-auth-link'

const app = new Elysia()
  .use(healthCheck)
  .use(registerRestaurant)
  .use(sendAuthLink)

app.listen(3333, () => {
  console.log('Http server running!')
})
