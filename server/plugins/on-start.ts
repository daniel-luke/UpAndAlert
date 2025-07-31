import {Logger} from "~~/server/utils/Logger";
import Database from "~~/server/modules/core/services/database";

export default defineNitroPlugin(async () => {
    const logger = Logger.getInstance();
    logger.info("core", "Starting up application");

    await Database.getInstance().init();
})
