import { uuid, timestamp, pgTable, pgEnum, integer } from 'drizzle-orm/pg-core'
import { users, restaurants, orderItems } from '.'
import { relations } from 'drizzle-orm'

export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'processing',
  'delivering',
  'delivered',
  'canceled',
])

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerId: uuid('customer_id').references(() => users.id, {
    onDelete: 'set null',
  }),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, {
      onDelete: 'cascade',
    }),
  status: orderStatusEnum('status').default('pending').notNull(),
  totalInCents: integer('total_in_cents').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const ordersRelations = relations(orders, ({ one, many }) => {
  return {
    customer: one(users, {
      fields: [orders.customerId],
      references: [users.id],
      relationName: 'order_customer',
    }),
    restaurant: one(restaurants, {
      fields: [orders.customerId],
      references: [restaurants.id],
      relationName: 'order_restaurant',
    }),
    ordersItems: many(orderItems),
  }
})
