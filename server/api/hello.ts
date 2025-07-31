import Database from "~~/server/modules/core/services/database";

export default defineEventHandler(async (event) => {
    setResponseStatus(event, 501);
    const log = Logger.getInstance();

    const db = Database.getInstance().getDB();
    let test = await db('test').select('*');

    log.warn("DB", test);
    return test;

})
