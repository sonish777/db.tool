import { ApiUserEntity, UserEntity } from 'shared/entities';
import { ConnectionStore } from 'shared/data-sources';
import { knex } from 'knex';
import { IRole } from 'shared/interfaces';

declare global {
    namespace Express {
        interface User {
            _id: string;
            twoFAEnabled: boolean;
            role?: IRole[];
        }

        interface Request extends Request {
            connectionStore: ConnectionStore;
            conn: knex.Knex;
        }
    }
}
