import { ColumnService } from '@api/services';
import {
    APIBaseController,
    APIProtectedRoute,
    ApiController,
    TypedQuery,
} from 'core/controllers';
import { ApiBearerAuth, ApiParameter, ApiTag } from 'core/swagger';
import { HTTPMethods, RespondPaginated } from 'core/utils';
import { CommonSearchQueryDto } from 'shared/dtos';

@ApiController('/columns')
@ApiTag('Columns')
export class ColumnController extends APIBaseController {
    protected title = 'Columns';
    protected module = 'columns';

    constructor(private readonly service: ColumnService) {
        super();
    }

    @APIProtectedRoute({
        method: HTTPMethods.Get,
        path: '/',
    })
    @ApiBearerAuth()
    @RespondPaginated()
    async get(req: TypedQuery<CommonSearchQueryDto>) {
        return this.service.paginateColumnsList(req.conn, {
            ...req.query,
        });
    }

    @ApiParameter({ in: 'query', schema: CommonSearchQueryDto })
    @ApiParameter({
        in: 'path',
        schema: [{ name: 'tableName', type: 'string', required: true }],
    })
    @APIProtectedRoute({
        method: HTTPMethods.Get,
        path: '/:tableName',
    })
    @ApiBearerAuth()
    @RespondPaginated()
    async getByTableName(req: TypedQuery<CommonSearchQueryDto>) {
        return this.service.paginateColumnsListByTable(req.conn, {
            ...req.query,
            tableName: req.params.tableName,
        });
    }
}
