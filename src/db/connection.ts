import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import { env } from '../util/env'

const connection = postgres(env.DATABASE_URL)

export const db = drizzle(connection, { schema })
