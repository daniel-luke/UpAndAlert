import {SQLite3DatabaseAdapter} from "~~/server/modules/core/adapters/SQLite3DatabaseAdapter";

export default defineEventHandler(async (event) => {
    const log = Logger.getInstance();

    const db = SQLite3DatabaseAdapter.getInstance();
    const knex = db.getKnex();

    return await knex.migrate.latest().then(() => {
        log.info("DB", "Migration complete");
        setResponseStatus(event, 200);
        return {
            status: "ok"
        }
    });
})
