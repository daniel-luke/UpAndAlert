export class Logger {
    static instance: Logger;

    private constructor() {
    }

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }

        return Logger.instance;
    }

    public info(module: string, message: string): void {
        console.info(`[UPANDALERT:${module.toUpperCase()}] (${new Date().toISOString()}) ${message}`);
    }
    public error(module: string, message: string): void {
        console.error(`[UPANDALERT:${module.toUpperCase()}] (${new Date().toISOString()}) ${message}`);
    }
    public warn(module: string, message: string): void {
        console.warn(`[UPANDALERT:${module.toUpperCase()}] (${new Date().toISOString()}) ${message}`);
    }
    public debug(module: string, message: string): void {
        console.debug(`[UPANDALERT:${module.toUpperCase()}] (${new Date().toISOString()}) ${message}`);
    }
}
