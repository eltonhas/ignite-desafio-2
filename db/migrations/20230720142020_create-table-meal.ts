/* eslint-disable prettier/prettier */
import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary()
    table.text('name').notNullable()
    table.text('description').notNullable()
    table.timestamp('date_time').notNullable()
    table.enu('diet', ['true', 'false']).notNullable()
    table.uuid('user_id').unsigned().notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()

    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
