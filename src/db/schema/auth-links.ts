import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users'

export const authLinks = pgTable('auth_links', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: text('code').notNull().unique(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})
