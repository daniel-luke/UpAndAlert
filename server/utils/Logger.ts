/**
 * @name Logger
 * @description Logger class to log messages to the console
 * @since 1.0.0
 * @author Daniel Groothuis
 */
export class Logger {
    static instance: Logger;

    private constructor() {
    }

    /**
     * @name getInstance
     * @description Get the instance of the logger
     * @returns {Logger} The instance of the logger
     */
    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }

        return Logger.instance;
    }

    /**
     * @name log
     * @description Log a message to the console
     * @param {string} module The module that is logging the message
     * @param {string} message The message to log
     */
    public info(module: string, message: string): void {
        console.info(`[UPANDALERT:${module.toUpperCase()}] (${new Date().toISOString()}) ${message}`);
    }

    /**
     * @name error
     * @description Log an error to the console
     * @param {string} module The module that is logging the message
     * @param {string} message The message to log
     */
    public error(module: string, message: string): void {
        console.error(`[UPANDALERT:${module.toUpperCase()}] (${new Date().toISOString()}) ${message}`);
    }

    /**
     * @name warn
     * @description Log a warning to the console
     * @param {string} module The module that is logging the message
     * @param {string} message The message to log
     */
    public warn(module: string, message: string): void {
        console.warn(`[UPANDALERT:${module.toUpperCase()}] (${new Date().toISOString()}) ${message}`);
    }

    /**
     * @name debug
     * @description Log a debug message to the console
     * @param {string} module The module that is logging the message
     * @param {string} message The message to log
     */
    public debug(module: string, message: string): void {
        console.debug(`[UPANDALERT:${module.toUpperCase()}] (${new Date().toISOString()}) ${message}`);
    }
}
