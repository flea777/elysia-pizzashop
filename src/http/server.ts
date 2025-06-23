import { Elysia, t } from 'elysia'
import { db } from '../db/connection'
import { restaurants, users } from '../db/schema'

import { CreateRestaurantDtoSchema } from './dtos/restaurant.dto'

const app = new Elysia()
  .get('/hello', () => {
    return 'Hello World'
  })
  .post(
    '/restaurants',
    async ({ body, set }) => {
      const { restaurantName, managerName, email, phone } = body

      const [manager] = await db
        .insert(users)
        .values({
          name: managerName,
          email,
          phone,
          role: 'manager',
        })
        .returning({
          id: users.id,
        })

      await db.insert(restaurants).values({
        name: restaurantName,
        managerId: manager?.id,
      })

      set.status = 204
    },
    {
      body: CreateRestaurantDtoSchema,
    }
  )

app.listen(3333, () => {
  console.log('Http server running!')
})
