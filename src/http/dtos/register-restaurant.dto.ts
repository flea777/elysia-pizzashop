import { t, type Static } from 'elysia'

export const CreateRestaurantDtoSchema = t.Object({
  restaurantName: t.String({
    minLength: 3,
    error: 'O nome do restaurante precisa ter pelo menos 3 caracteres!',
  }),
  managerName: t.String({
    minLength: 3,
    error: 'O nome do gerente precisa ter pelo menos 3 caracteres!',
  }),
  phone: t.String({
    minLength: 10,
    maxLength: 11,
    pattern: '^[0-9]+$',
    description:
      'Telefone com DDD, contendo apenas dígitos. 10 para fixo e 11 para celular.',
    examples: ['1140044004', '11987654321'],
  }),
  email: t.String({ format: 'email' }),
})

export type CreateRestaurantDto = Static<typeof CreateRestaurantDtoSchema>
