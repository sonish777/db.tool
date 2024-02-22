import knex from 'knex';

export class ConnectionStore {
    private readonly _connections: Record<string, knex.Knex> = {};

    get connections() {
        return this._connections;
    }

    get(dbIdentifier: string) {
        return this.connections[dbIdentifier];
    }

    set(dbIdentifier: string, conn: knex.Knex) {
        this._connections[dbIdentifier] = conn;
    }
}
