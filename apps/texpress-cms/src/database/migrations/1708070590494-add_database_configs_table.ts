import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddDatabaseConfigsTable1708070590494
    implements MigrationInterface
{
    tableName = 'database_configurations';
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: this.tableName,
                columns: [
                    {
                        name: '_id',
                        type: 'uuid',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'host',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'port',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'databaseName',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'username',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'password',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.tableName);
    }
}
