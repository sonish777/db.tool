import { TableQueryDTO } from '@api/dtos/table-query.dto';
import { TableService } from '@api/services';
import {
    APIBaseController,
    APIProtectedRoute,
    ApiController,
    TypedQuery,
} from 'core/controllers';
import { ApiBearerAuth, ApiParameter, ApiTag } from 'core/swagger';
import { HTTPMethods, RespondPaginated } from 'core/utils';

@ApiController('/tables')
@ApiTag('Tables')
export class TableController extends APIBaseController {
    protected title = 'Tables';
    protected module = 'tables';

    constructor(private readonly service: TableService) {
        super();
    }

    @ApiParameter({ in: 'query', schema: TableQueryDTO })
    @APIProtectedRoute({
        method: HTTPMethods.Get,
        path: '/',
    })
    @RespondPaginated()
    @ApiBearerAuth()
    get(req: TypedQuery<TableQueryDTO>) {
        const conn = req.conn;
        return this.service.paginateTablesList(conn, req.query);
    }
}
