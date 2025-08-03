import type {Knex} from "knex";

/**
 * @name DatabaseAdapter
 * @description Abstract class for database adapters
 * @since 1.0.0
 * @author Daniel Groothuis
 */
export abstract class DatabaseAdapter {

    protected constructor() {}

    public abstract connect(): Promise<void>;
    public abstract migrate(): Promise<void>;
    public abstract getKnex(): Knex;
    public abstract close(): Promise<void>;
}
