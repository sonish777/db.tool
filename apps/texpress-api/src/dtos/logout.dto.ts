import { Schema, SchemaProperty } from 'core/swagger';

@Schema()
export class LogoutDTO {
    @SchemaProperty({
        type: 'string',
    })
    accessToken: string;
}
