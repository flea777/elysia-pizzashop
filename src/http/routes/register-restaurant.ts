import Elysia from 'elysia'
import { db } from '../../db/connection'
import { restaurants, users } from '../../db/schema'
import { CreateRestaurantDtoSchema } from '../dtos/register-restaurant.dto'

export const registerRestaurant = new Elysia().post(
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
    detail: {
      summary: 'Endpoint de criação de restaurante e gerente',
      description: 'Retorna o nome do restaurante e o id do gerente, além do status 204, se tudo ocorreu certo',
      tags: ['Restaurants', 'Managers']
    },
  }
)
