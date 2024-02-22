import { CreateDBConfigDTO } from '@api/dtos/create-db-config.dto';
import { DatabaseConfigurationService } from '@api/services';
import {
    APIBaseController,
    APIProtectedRoute,
    ApiController,
    Route,
    TypedBody,
} from 'core/controllers';
import { ApiBearerAuth, ApiBody, ApiTag } from 'core/swagger';
import { HTTPMethods, RespondCreated, RespondItem } from 'core/utils';
import { Request } from 'express';

@ApiController('/db-configs')
@ApiTag('Database Configurations')
export class DatabaseConfigurationController extends APIBaseController {
    protected title = 'Database Configuration';
    protected module = 'database-configuration';

    constructor(private readonly service: DatabaseConfigurationService) {
        super();
    }

    @Route({
        method: HTTPMethods.Post,
        path: '/',
    })
    @RespondItem()
    @ApiBody({
        schema: CreateDBConfigDTO,
    })
    createDatabaseConfiguration(req: TypedBody<CreateDBConfigDTO>) {
        return this.service.createDbConfig(req.body);
    }

    @APIProtectedRoute({
        method: HTTPMethods.Get,
        path: '/self',
    })
    @RespondItem()
    @ApiBearerAuth()
    async getSelfDatabaseConfigs(req: Request) {
        console.log('header', req.headers.authorization);
        return { message: 'OK' };
    }
}
