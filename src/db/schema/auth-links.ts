import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users'

export const authLinks = pgTable('auth_links', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: uuid('code').notNull().unique().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, {
      onDelete: 'cascade'
    })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})
