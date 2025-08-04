export function up(knex) {
    return knex.schema.createTable('monitors', (table) => {
        table.increments('id').primary()
        table.string('name').notNullable()
        table.string('monitor_type').notNullable().defaultTo('http')
        table.string('address').notNullable()
        table.integer('polling_interval').notNullable().defaultTo(60)
        table.boolean('in_maintenance').notNullable().defaultTo(false)
        table.boolean('is_active').notNullable().defaultTo(true)
    })
}

export function down(knex) {
    return knex.schema.dropTable('monitors')
}
