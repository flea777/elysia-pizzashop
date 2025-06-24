import { Elysia, t } from 'elysia'
import { healthCheck } from './routes/health-check'
import { registerRestaurant } from './routes/register-restaurant'

const app = new Elysia()
  .use(healthCheck)
  .use(registerRestaurant)

app.listen(3333, () => {
  console.log('Http server running!')
})
