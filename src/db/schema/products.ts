import { uuid, text, timestamp, pgTable, integer } from 'drizzle-orm/pg-core'
import { orderItems, restaurants } from '.'
import { relations } from 'drizzle-orm'

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  priceInCents: integer('price_in_cents').notNull(),
  restaurantId: uuid('restaurant_id').notNull().references(() => restaurants.id, {
    onDelete: 'cascade',
  }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const productsRelations = relations(products, ({ one, many }) => {
  return {
    restaurant: one(restaurants, {
      fields: [products.restaurantId],
      references: [restaurants.id],
      relationName: 'product_restaurant',
    }),
    ordersItems: many(orderItems),
  }
})