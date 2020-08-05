import knex from 'knex'

export async function up(knex: knex) {
  return knex.schema.createTable('connections', (table) => {
    table.increments('id').primary()
    table.integer('week_day').notNullable()
    table.integer('from').notNullable()
    table.integer('to').notNullable()

    table
      .integer('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')

    table.timestamp('create_at').defaultTo('now').notNullable()
  })
}

export async function down(knex: knex) {
  return knex.schema.dropTable('connections')
}
