import { TableQueryDTO } from '@api/dtos/table-query.dto';
import { TableTypes } from '@api/types';
import knex from 'knex';
import { TableStats } from 'shared/interfaces';
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
}
