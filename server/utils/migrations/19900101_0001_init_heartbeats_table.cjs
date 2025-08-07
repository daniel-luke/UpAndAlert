exports.up = function (knex) {
    return knex.schema.createTable('heartbeats', (table) => {
        table.increments('id').primary()
        table.integer('monitor_id').unsigned().notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.string('status').notNullable().defaultTo('up')
        table.integer('status_code').notNullable()
        table.integer('response_time').notNullable()

        table.foreign('monitor_id').references('id').inTable('monitors')
    })
}

exports.down = function (knex) {
    return knex.schema.dropTable('heartbeats')
}
