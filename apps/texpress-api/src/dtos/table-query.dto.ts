import { Schema, SchemaProperty } from 'core/swagger';
import { CommonSearchQueryDto } from 'shared/dtos';

@Schema()
export class TableQueryDTO extends CommonSearchQueryDto {
    @SchemaProperty({ type: 'string', required: false })
    table_type?: 'table' | 'view';
}
