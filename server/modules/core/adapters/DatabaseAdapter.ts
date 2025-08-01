export abstract class DatabaseAdapter {

    protected constructor() {}

    public abstract connect(): Promise<void>;
    public abstract migrate(): Promise<void>;
    public abstract getKnex(): any;
    public abstract close(): Promise<void>;
}
