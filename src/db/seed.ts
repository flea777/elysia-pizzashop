import { faker } from '@faker-js/faker'
import {
  users,
  restaurants,
  orderItems,
  orders,
  products,
  authLinks,
} from './schema'
import { db } from './connection'
import chalk from 'chalk'

/**
 * Reset database
 */
await db.delete(orderItems)
await db.delete(orders)
await db.delete(products)
await db.delete(restaurants)
await db.delete(users)
await db.delete(authLinks)

console.log(chalk.yellowBright('✔️ Database reset!'))

/**
 * Create customers
 */
const [customer1, customer2] = await db
  .insert(users)
  .values([
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: 'customer',
    },
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: 'customer',
    },
  ])
  .returning()

console.log(chalk.yellowBright('✔️ Created customers!'))

/**
 * Create manager
 */
const [manager] = await db
  .insert(users)
  .values([
    {
      name: faker.person.fullName(),
      email: 'admin@admin.com',
      role: 'manager',
    },
  ])
  .returning()

console.log(chalk.yellowBright('✔️ Created manager!'))

/**
 * Create restaurant
 */
const [restaurant] = await db
  .insert(restaurants)
  .values([
    {
      name: faker.company.name(),
      description: faker.lorem.paragraph(),
      managerId: manager!.id,
    },
  ])
  .returning()

console.log(chalk.yellowBright('✔️ Created restaurant!'))

/**
 * Create products
 */
type ProductInsert = typeof products.$inferInsert

const productsToInsert: ProductInsert[] = []

for (let i = 0; i < 50; i++) {
  productsToInsert.push({
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    restaurantId: restaurant!.id,
    priceInCents: Number(faker.commerce.price({ min: 190, max: 490, dec: 0 })),
  })
}

const availableProducts = await db
  .insert(products)
  .values(productsToInsert)
  .returning()

console.log(chalk.yellowBright('✔️ Created products!'))

/**
 * Create orders and order items (no createId, using DB-generated ID)
 */
type OrderItemInsert = typeof orderItems.$inferInsert

for (let i = 0; i < 25000; i++) {
  const orderProducts = faker.helpers.arrayElements(availableProducts, {
    min: 1,
    max: 3,
  })

  let totalInCents = 0
  const orderItemBatch: Omit<OrderItemInsert, 'orderId'>[] = []

  orderProducts.forEach((product) => {
    const quantity = faker.number.int({ min: 1, max: 3 })
    const price = product.priceInCents

    totalInCents += price * quantity

    orderItemBatch.push({
      productId: product.id,
      priceInCents: price,
      quantity,
    })
  })

  const [order] = await db
    .insert(orders)
    .values({
      customerId: faker.helpers.arrayElement([customer1!.id, customer2!.id]),
      restaurantId: restaurant!.id,
      totalInCents,
      status: faker.helpers.arrayElement([
        'pending',
        'processing',
        'delivering',
        'delivered',
        'canceled',
      ]),
      createdAt: faker.date.recent({ days: 40 }),
    })
    .returning({ id: orders.id })

  const orderItemsWithOrderId: OrderItemInsert[] = orderItemBatch.map(
    (item) => ({
      ...item,
      orderId: order!.id,
    })
  )

  await db.insert(orderItems).values(orderItemsWithOrderId)
}

console.log(chalk.yellowBright('✔️ Created orders!'))
console.log(chalk.greenBright('🎉 Database seeded successfully!'))

process.exit(0)
