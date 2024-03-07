import { ValidationBuilder } from 'core/utils';
import { ValidatorWithStaticProps } from 'core/validators';
import { ValidationChain } from 'express-validator';

export class ConnectValidator
    implements ValidatorWithStaticProps<typeof ConnectValidator>
{
    static get rules(): Record<string, ValidationChain> {
        return {
            host: ValidationBuilder.ForField('host')
                .Required({
                    fieldDisplayName: 'Host',
                })
                .build(),
            port: ValidationBuilder.ForField('port')
                .Required({
                    fieldDisplayName: 'Port',
                })
                .build(),
            username: ValidationBuilder.ForField('username')
                .Required({
                    fieldDisplayName: 'Username',
                })
                .build(),
            password: ValidationBuilder.ForField('password')
                .Required({
                    fieldDisplayName: 'Password',
                })
                .build(),
            databaseName: ValidationBuilder.ForField('databaseName')
                .Required({
                    fieldDisplayName: 'Database Name',
                })
                .build(),
        };
    }
}
