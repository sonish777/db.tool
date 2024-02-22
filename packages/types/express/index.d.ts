import { ApiUserEntity, UserEntity } from 'shared/entities';
import { ConnectionStore } from 'shared/data-sources';
import { knex } from 'knex';
export {};

declare global {
    namespace Express {
        interface User {
            _id: string;
        }

        interface Request extends Request {
            connectionStore: ConnectionStore;
            conn: knex.Knex;
        }
    }
}
