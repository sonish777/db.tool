import { ProviderStaticMethod } from 'core/providers';
import { Express } from 'express';
import { ConnectionStore } from 'shared/data-sources';

export class ConnectionStoreProvider
    implements ProviderStaticMethod<typeof ConnectionStoreProvider>
{
    public static register(app: Express) {
        const connectionStore = new ConnectionStore();
        app.use((req, _res, next) => {
            req.connectionStore = connectionStore;
            next();
        });
    }
}
