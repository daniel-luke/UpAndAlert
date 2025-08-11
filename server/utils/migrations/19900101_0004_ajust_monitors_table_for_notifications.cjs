exports.up = function (knex) {
    return knex.schema.alterTable('monitors', (table) => {
        table.boolean('notified').defaultTo(false)
    })
}

exports.down = function (knex) {
    return knex.schema.dropColumn('notified')
}
