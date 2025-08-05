import { Elysia } from 'elysia'
import { healthCheck } from './routes/health-check'
import { registerRestaurant } from './routes/register-restaurant'
import { sendAuthLink } from './routes/send-auth-link'
import { authenticateFromLink } from './routes/authenticate-from-link'
import { getProfile } from './routes/get-profile'
import { getManagedRestaurant } from './routes/get-managed-restaurant'
import { errorHandler } from './plugins/error-handler'
import { swaggerPlugin } from './plugins/swagger'
import chalk from 'chalk'
import { getOrderDetails } from './routes/get-order-details'
import { approveOrder } from './routes/approve-order'
import { cancelOrder } from './routes/cancel-order'
import { deliverOrder } from './routes/deliver-oder'
import { dispatchOrder } from './routes/dispatch-order'
import { getOrders } from './routes/get-orders'
import { getMonthRevenue } from './routes/get-month-revenue'
import { getDayOrdersAmount } from './routes/get-day-orders-amount'

new Elysia()
  .use(swaggerPlugin)
  .use(errorHandler)
  .use(healthCheck)
  .use(registerRestaurant)
  .use(sendAuthLink)
  .use(getOrderDetails)
  .use(approveOrder)
  .use(cancelOrder)
  .use(deliverOrder)
  .use(dispatchOrder)
  .use(authenticateFromLink)
  .use(getProfile)
  .use(getOrders)
  .use(getManagedRestaurant)
  .use(getMonthRevenue)
  .use(getDayOrdersAmount)
  .listen(3333, () => {
    console.log(chalk.magentaBright('Http server running!'))
  })
