import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddAccessTokenDbConfigsTable1708337404949
    implements MigrationInterface
{
    tableName = 'database_configurations';
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            this.tableName,
            new TableColumn({
                name: 'accessToken',
                type: 'varchar',
                isNullable: true,
                isUnique: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn(this.tableName, 'accessToken');
    }
}
