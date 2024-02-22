import { CreateDBConfigDTO } from '@api/dtos/create-db-config.dto';
import { Service } from 'typedi';
import knex from 'knex';
import { GetRepository } from 'core/entities';
import { DatabaseConfigurationEntity } from 'shared/entities';
import { Repository } from 'typeorm';
import { NotFoundException } from 'shared/exceptions';
import { BaseService } from 'core/services';
import crypto from 'crypto';
import config from 'config';

@Service()
export class DatabaseConfigurationService extends BaseService<DatabaseConfigurationEntity> {
    @GetRepository(DatabaseConfigurationEntity)
    readonly repository: Repository<DatabaseConfigurationEntity>;

    async testConnection(dbConfig: CreateDBConfigDTO) {
        const conn = knex({
            client: 'pg',
            connection: {
                host: dbConfig.host,
                port: Number(dbConfig.port),
                user: dbConfig.username,
                password: dbConfig.password,
                database: dbConfig.databaseName,
            },
        });
        await conn.raw('SELECT 1');
        return conn;
    }

    generateDBIdentifier(dbConfig: CreateDBConfigDTO) {
        return `${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.databaseName}`;
    }

    decipherDbConfigPassword(password: string) {
        const textParts = password.split(':');
        const iv = Buffer.from(textParts.shift()!, 'hex');
        const encryptedTextBuffer = Buffer.from(textParts.join(':'), 'hex');

        const decipher = crypto.createDecipheriv(
            'aes-256-ctr',
            Buffer.from(config.get<string>('cipherSecret'), 'hex'),
            iv
        );
        const decryptedText = Buffer.concat([
            decipher.update(encryptedTextBuffer),
            decipher.final(),
        ]);

        return decryptedText.toString();
    }

    async createDbConfig(createDbConfigDto: CreateDBConfigDTO): Promise<{
        conn: knex.Knex;
        dbConfig: DatabaseConfigurationEntity;
    }> {
        const { password, ...restDbConfig } = createDbConfigDto;
        let dbConfig: DatabaseConfigurationEntity | null;
        const conn = await this.testConnection(createDbConfigDto);
        dbConfig = await this.repository.findOne({
            where: restDbConfig,
        });
        if (!dbConfig) {
            dbConfig = await this.create(createDbConfigDto);
        }
        return { conn, dbConfig };
    }

    async updateDbConfig(
        _id: string,
        updateDbConfigDto: Partial<CreateDBConfigDTO>
    ) {
        const dbConfig = await this.repository.findOne({ where: { _id: _id } });
        if (!dbConfig) {
            throw new NotFoundException('Database Configuration not found');
        }
        return this.repository.save({
            ...dbConfig,
            ...updateDbConfigDto,
        });
    }
}
