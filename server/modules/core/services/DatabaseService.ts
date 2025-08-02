import {SQLite3DatabaseAdapter} from "~~/server/modules/core/adapters/SQLite3DatabaseAdapter";
import {Logger} from "~~/server/utils/Logger";

/**
 * @name DatabaseService
 * @description Service for database operations
 * @since 1.0.0
 * @author Daniel Groothuis
 */
export class DatabaseService {
    private static _instance: DatabaseService;
    private adapter: any;

    /**
     * @name constructor
     * @description Constructor for DatabaseService
     * @private
     */
    private constructor() {
        const logger = Logger.getInstance();

        switch (process.env.DB_TYPE) {
            case "sqlite3":
                this.adapter = SQLite3DatabaseAdapter.getInstance();
                break;
            default:
                logger.error("core", "No database type specified");
                process.exit(1);
        }
    }

    /**
     * @name getInstance
     * @description Get instance of DatabaseService
     * @returns {DatabaseService}
     */
    public static getInstance(): DatabaseService {
        if (!DatabaseService._instance) {
            DatabaseService._instance = new DatabaseService();
        }
        return DatabaseService._instance;
    }

    /**
     * @name getAdapter
     * @description Get adapter for database operations
     * @returns {any}
     */
    public getAdapter(): any {
        return this.adapter;
    }
}
