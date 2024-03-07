import { Expose } from 'class-transformer';
import { Schema, SchemaProperty } from 'core/swagger';

@Schema()
export class CreateDBConfigDTO {
    @Expose()
    @SchemaProperty({ type: 'string', required: true })
    host: string;

    @Expose()
    @SchemaProperty({ type: 'string', required: true })
    port: string;

    @Expose()
    @SchemaProperty({ type: 'string', required: true })
    username: string;

    @Expose()
    @SchemaProperty({ type: 'string', required: true })
    password: string;

    @Expose()
    @SchemaProperty({ type: 'string', required: true })
    databaseName: string;

    @Expose()
    accessToken?: string;
}
