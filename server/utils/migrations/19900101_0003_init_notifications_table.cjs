exports.up = function (knex) {
    return knex.schema
        .createTable('notifications', (table) => {
            table.increments('id').primary()
            table.string('name').notNullable()
            table.string('notification_type').notNullable().defaultTo('smtp')
            table.string('hostname').nullable()
            table.integer('port').nullable()
            table.string('username').nullable()
            table.string('password').nullable()
            table.string('from').nullable()
            table.string('to').nullable()
            table.string('cc').nullable()
            table.string('bcc').nullable()
            table.string('subject').nullable()
            table.string('message').nullable()
            table.boolean('tls').nullable().defaultTo(false)
            table.boolean('is_active').notNullable().defaultTo(true)
        })
        .createTable('monitor_notifications', (table) => {
            table.increments('id').primary()
            table
                .integer('monitor_id')
                .unsigned()
                .notNullable()
                .references('monitors.id')
                .onDelete('CASCADE')
            table
                .integer('notification_id')
                .unsigned()
                .notNullable()
                .references('notifications.id')
                .onDelete('CASCADE')
            table.unique(['monitor_id', 'notification_id'])
        })
}

exports.down = function (knex) {
    return knex.schema.dropTable('notifications').dropTable('monitor_notifications')
}
