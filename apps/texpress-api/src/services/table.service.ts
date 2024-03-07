import { TableQueryDTO } from '@api/dtos/table-query.dto';
import { TableTypes } from '@api/types';
import knex from 'knex';
import { CommonSearchQueryDto } from 'shared/dtos';
import { TableIndexes, TableStats } from 'shared/interfaces';
import { getPaginationMetadata, getPaginationResponse } from 'shared/utils';
import { Service } from 'typedi';

@Service()
export class TableService {
    async paginateTablesList(conn: knex.Knex, searchDto: TableQueryDTO) {
        const paginationMetadata = getPaginationMetadata(searchDto);
        const result: TableStats[] = await conn
            .select([
                't.table_name',
                't.table_type',
                conn.raw('cast(st.n_tup_ins as integer) as n_tup_ins'),
                conn.raw('cast(st.n_tup_upd as integer) as n_tup_upd'),
                conn.raw('cast(st.n_tup_del as integer) as n_tup_del'),
                conn.raw('cast(st.n_live_tup as integer) as n_live_tup'),
                conn.raw('count(*) OVER()::int as total'),
            ])
            .from('information_schema.tables as t')
            .leftJoin(
                'information_schema.columns as c',
                't.table_name',
                'c.table_name'
            )
            .leftJoin('pg_stat_user_tables as st', 't.table_name', 'st.relname')
            .where({
                't.table_schema': 'public',
                'c.table_schema': 'public',
            })
            .modify((builder) => {
                if (searchDto.table_type) {
                    builder.andWhere({
                        't.table_type': TableTypes[searchDto.table_type],
                    });
                }
            })
            .groupBy([
                't.table_name',
                't.table_type',
                'st.n_live_tup',
                'st.n_tup_ins',
                'st.n_tup_upd',
                'st.n_tup_del',
            ])
            .limit(paginationMetadata.take)
            .offset(paginationMetadata.skip);

        // Extract the total from the first row
        const total = result[0]?.total || 0;

        // Remove the total field from each row
        const data = result.map(({ total, ...rest }) => rest);

        return getPaginationResponse(data, {
            ...paginationMetadata,
            total: total,
        });
    }

    async paginateTableIndexList(
        conn: knex.Knex,
        tableName: string,
        searchDto: CommonSearchQueryDto
    ) {
        const paginationMetadata = getPaginationMetadata(searchDto);
        const data: TableIndexes[] = await conn
            .select(
                'i.tablename',
                'i.indexname',
                'am.amname as indextype',
                conn.raw(
                    "array_to_string(array_agg(attr.attname), ', ') as columns"
                ),
                'i.indexdef',
                conn.raw(`CASE 
                    WHEN idx.indisprimary THEN 'Primary Key'
                    WHEN idx.indisunique THEN 'Unique Key'
                    ELSE 'Performance' END as index_category`)
            )
            .from('pg_class as c')
            .join('pg_namespace as n', 'n.oid', 'c.relnamespace')
            .join('pg_index as idx', 'idx.indexrelid', 'c.oid')
            .join('pg_am as am', 'am.oid', 'c.relam')
            .join('pg_class as tbl', 'idx.indrelid', 'tbl.oid')
            .join('pg_attribute as attr', function () {
                this.on('attr.attnum', conn.raw('ANY(idx.indkey)')).andOn(
                    'attr.attrelid',
                    'tbl.oid'
                );
            })
            .join('pg_indexes as i', 'i.indexname', 'c.relname')
            .where('n.nspname', 'public')
            .andWhere('i.tablename', tableName)
            .groupBy(
                'i.tablename',
                'i.indexname',
                'am.amname',
                'i.indexdef',
                'idx.indisprimary',
                'idx.indisunique'
            )
            .limit(paginationMetadata.take)
            .offset(paginationMetadata.skip);

        const countQuery = await conn('pg_indexes')
            .count('indexname as total')
            .where('tablename', tableName);
        return getPaginationResponse(data, {
            ...paginationMetadata,
            total: Number(countQuery?.[0]?.total || 0),
        });
    }
}
