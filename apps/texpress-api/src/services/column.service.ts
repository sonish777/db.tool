import { ColumnByTableQueryDTO } from '@api/dtos';
import knex from 'knex';
import { Column } from 'shared/interfaces';
import { getPaginationMetadata, getPaginationResponse } from 'shared/utils';
import { Service } from 'typedi';

@Service()
export class ColumnService {
    async paginateColumnsListByTable(
        conn: knex.Knex,
        searchDto: ColumnByTableQueryDTO
    ) {
        const paginationMetadata = getPaginationMetadata(searchDto);
        const subquery = `
        SELECT 
            a.attname AS column_name,
            confrelid::regclass AS referenced_table,
            af.attname AS referenced_column_name
        FROM 
            pg_constraint con 
        JOIN 
            pg_attribute a ON a.attnum = ANY(con.conkey)
        JOIN 
            pg_attribute af ON af.attnum = ANY(con.confkey) AND af.attrelid = con.confrelid
        WHERE 
            con.confrelid != 0
            AND con.conrelid = ?::regclass
            AND a.attrelid = ?::regclass
    `;

        const data: Column[] = await conn
            .select(
                'c.column_name',
                'c.data_type',
                'c.character_maximum_length',
                'c.is_nullable',
                'c.column_default',
                'tc.constraint_type',
                'd.referenced_table',
                'd.referenced_column_name'
            )
            .from('information_schema.columns AS c')
            .leftJoin(
                'information_schema.key_column_usage AS kcu',
                function () {
                    this.on('c.column_name', '=', 'kcu.column_name').andOn(
                        conn.raw('kcu.table_name = ?', [searchDto.tableName])
                    );
                }
            )
            .leftJoin(
                'information_schema.table_constraints AS tc',
                'tc.constraint_name',
                'kcu.constraint_name'
            )
            .leftJoin(
                conn.raw(`(${subquery}) as d`, [
                    searchDto.tableName,
                    searchDto.tableName,
                ]),
                'c.column_name',
                'd.column_name'
            )
            .where('c.table_name', searchDto.tableName)
            .limit(paginationMetadata.take)
            .offset(paginationMetadata.skip);

        const countQuery = await conn('information_schema.columns AS c')
            .count('* as total')
            .where('c.table_name', searchDto.tableName);

        return getPaginationResponse(data, {
            ...paginationMetadata,
            total: Number(countQuery?.[0]?.total || 0),
        });
    }
}
