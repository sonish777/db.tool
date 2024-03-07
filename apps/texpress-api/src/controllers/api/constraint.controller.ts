import { ConstraintService } from '@api/services';
import {
    APIBaseController,
    APIProtectedRoute,
    ApiController,
    TypedQuery,
} from 'core/controllers';
import { ApiBearerAuth, ApiParameter, ApiTag } from 'core/swagger';
import { HTTPMethods, RespondPaginated } from 'core/utils';
import { CommonSearchQueryDto } from 'shared/dtos';

@ApiController('/constraints')
@ApiTag('Constraints')
export class ConstraintController extends APIBaseController {
    protected title = 'Constraints';
    protected module = 'constraints';

    constructor(private readonly service: ConstraintService) {
        super();
    }

    @APIProtectedRoute({
        method: HTTPMethods.Get,
        path: '/keys',
    })
    @ApiBearerAuth()
    @ApiParameter({ in: 'query', schema: CommonSearchQueryDto })
    @RespondPaginated()
    getKeyConstraints(req: TypedQuery<CommonSearchQueryDto>) {
        const conn = req.conn;
        return this.service.paginateKeysConstraintsList(conn, req.query);
    }

    @APIProtectedRoute({
        method: HTTPMethods.Get,
        path: '/check',
    })
    @ApiParameter({ in: 'query', schema: CommonSearchQueryDto })
    @ApiBearerAuth()
    @RespondPaginated()
    getCheckConstraints(req: TypedQuery<CommonSearchQueryDto>) {
        const conn = req.conn;
        return this.service.paginateCheckConstraintsList(conn, req.query);
    }
}
