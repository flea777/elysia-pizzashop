import Elysia from 'elysia'
import swagger from '@elysiajs/swagger'

export const swaggerPlugin = new Elysia().use(swagger({
  documentation: {
    info: {
      title: 'PizzaShop Documentation',
      version: '1.0.0',
    },
  },
}))