export function up(knex) {
    return knex.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('username').unique().notNullable();
        table.string('password').notNullable();
        table.string('email').unique();
        table.boolean('isAdmin').defaultTo(false);
        table.timestamps(true, true);
    });
}

export function down(knex) {
    return knex.schema.dropTable('users');
}
