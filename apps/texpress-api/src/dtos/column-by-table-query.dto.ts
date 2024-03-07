import { Schema, SchemaProperty } from 'core/swagger';
import { CommonSearchQueryDto } from 'shared/dtos';

@Schema()
export class ColumnByTableQueryDTO extends CommonSearchQueryDto {
    @SchemaProperty({ type: 'string', required: true })
    tableName: string;
}
