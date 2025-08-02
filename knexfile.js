// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
    migrations: {
      directory: 'server/utils/migrations'
    },
  client: 'sqlite3',
  connection: {
    filename: '.data/db.sqlite3'
  }
};
