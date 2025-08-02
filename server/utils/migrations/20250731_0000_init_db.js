export function up(knex) {
    return knex.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('email').unique().notNullable();
        table.string('password_hash').notNullable();
        table.string('first_name').notNullable();
        table.string('last_name').notNullable();
        table.boolean('is_admin').notNullable().defaultTo(false);
    });
}

export function down(knex) {
    return knex.schema.dropTable('users');
}
