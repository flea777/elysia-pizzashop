import { t, type Static } from 'elysia'

export const CreateRestaurantDtoSchema = t.Object(
  {
    restaurantName: t.String({
      minLength: 3,
      error: 'The restaurant name must have at least 3 characters.',
    }),
    managerName: t.String({
      minLength: 3,
      error: 'The manager name must have at least 3 characters.',
    }),
    phone: t.String({
      minLength: 10,
      maxLength: 11,
      pattern: '^[0-9]+$',
      description:
        'Phone with area code, containing only digits. 10 for landline and 11 for mobile.',
      examples: ['1140044004', '11987654321'],
      error: 'The phone must have between 10 and 11 characters',
    }),
    email: t.String({
      format: 'email',
      error: 'Please use the format name@email.com',
    }),
  },
  {
    error:
      'The restaurant must have restaurantName, managerName, phone and email',
  }
)
export type CreateRestaurantDto = Static<typeof CreateRestaurantDtoSchema>
