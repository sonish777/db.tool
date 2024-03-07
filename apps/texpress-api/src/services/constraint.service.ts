import { ForeignConstraint } from '@api/types';
import knex from 'knex';
import { CommonSearchQueryDto } from 'shared/dtos';
import { CheckConstraint, KeyConstraint } from 'shared/interfaces';
import { getPaginationMetadata, getPaginationResponse } from 'shared/utils';
import { Service } from 'typedi';

@Service()
export class ConstraintService {
    async paginateKeysConstraintsList(
        conn: knex.Knex,
        searchDto: CommonSearchQueryDto
    ) {
        const paginationMetadata = getPaginationMetadata(searchDto);

        let data: KeyConstraint[] = await conn
            .select(
                'tc.constraint_catalog',
                'tc.constraint_schema',
                'tc.table_name',
                'tc.constraint_type',
                'tc.constraint_name',
                conn.raw('pg_get_constraintdef(con.oid) as constraint_code'),
                conn.raw('con.confrelid::regclass AS referenced_table'),
                conn.raw(
                    'array_agg(att.attname) filter(where att.attname is not null)::varchar[] AS referenced_columns'
                ),
                conn.raw(
                    'array_agg(att_referencing.attname) filter(where att_referencing.attname is not null)::varchar[] AS column_names'
                ),
                'con.confupdtype AS update_rule',
                'con.confdeltype AS delete_rule'
            )
            .from('information_schema.table_constraints as tc')
            .join(
                'pg_catalog.pg_constraint as con',
                'tc.constraint_name',
                '=',
                'con.conname'
            )
            .leftJoin('pg_catalog.pg_attribute as att', function () {
                this.on('att.attnum', conn.raw('ANY(con.confkey)')).andOn(
                    'att.attrelid',
                    '=',
                    'con.confrelid'
                );
            })
            .leftJoin(
                'pg_catalog.pg_attribute as att_referencing',
                function () {
                    this.on(
                        'att_referencing.attnum',
                        conn.raw('ANY(con.conkey)')
                    ).andOn('att_referencing.attrelid', '=', 'con.conrelid');
                }
            )
            .whereNot('tc.constraint_schema', 'like', 'pg_%')
            .whereNot('tc.constraint_schema', 'information_schema')
            .andWhereNot('constraint_type', 'CHECK')
            .groupBy(
                'tc.constraint_catalog',
                'tc.constraint_schema',
                'tc.table_name',
                'tc.constraint_type',
                'tc.constraint_name',
                'con.oid',
                'con.confrelid',
                'update_rule',
                'delete_rule'
            )
            .limit(paginationMetadata.take)
            .offset(paginationMetadata.skip);

        data = data.map((constraint) => ({
            ...constraint,
            update_rule:
                ForeignConstraint[constraint.update_rule?.trim()] || '',
            delete_rule:
                ForeignConstraint[constraint.delete_rule?.trim()] || '',
            referenced_table:
                constraint.referenced_table === '-'
                    ? ''
                    : constraint.referenced_table,
        }));
        const countQuery = await conn(
            'information_schema.table_constraints as tc'
        )
            .count('* as total')
            .whereNot('constraint_schema', 'like', 'pg_%')
            .andWhereNot('constraint_schema', 'information_schema')
            .andWhereNot('constraint_type', 'CHECK');
        return getPaginationResponse(data, {
            ...paginationMetadata,
            total: Number(countQuery?.[0]?.total || 0),
        });
    }

    async paginateCheckConstraintsList(
        conn: knex.Knex,
        searchDto: CommonSearchQueryDto
    ) {
        const paginationMetadata = getPaginationMetadata(searchDto);

        let data: CheckConstraint[] = await conn
            .select(
                'tc.constraint_catalog',
                'tc.constraint_schema',
                'tc.table_name',
                'tc.constraint_type',
                'tc.constraint_name',
                conn.raw('pg_get_constraintdef(con.oid) as constraint_code'),
                conn.raw(
                    'array_agg(att_referencing.attname) filter(where att_referencing.attname is not null)::varchar[] AS column_names'
                )
            )
            .from('information_schema.table_constraints as tc')
            .join(
                'pg_catalog.pg_constraint as con',
                'tc.constraint_name',
                '=',
                'con.conname'
            )
            .leftJoin(
                'pg_catalog.pg_attribute as att_referencing',
                function () {
                    this.on(
                        'att_referencing.attnum',
                        conn.raw('ANY(con.conkey)')
                    ).andOn('att_referencing.attrelid', '=', 'con.conrelid');
                }
            )
            .whereNot('tc.constraint_schema', 'like', 'pg_%')
            .whereNot('tc.constraint_schema', 'information_schema')
            .andWhere('constraint_type', 'CHECK')
            .groupBy(
                'tc.constraint_catalog',
                'tc.constraint_schema',
                'tc.table_name',
                'tc.constraint_type',
                'tc.constraint_name',
                'con.oid'
            )
            .limit(paginationMetadata.take)
            .offset(paginationMetadata.skip);

        const countQuery = await conn(
            'information_schema.table_constraints as tc'
        )
            .join(
                'pg_catalog.pg_constraint as con',
                'tc.constraint_name',
                '=',
                'con.conname'
            )
            .count('* as total')
            .whereNot('tc.constraint_schema', 'like', 'pg_%')
            .whereNot('tc.constraint_schema', 'information_schema')
            .andWhere('constraint_type', 'CHECK');
        return getPaginationResponse(data, {
            ...paginationMetadata,
            total: Number(countQuery?.[0]?.total || 0),
        });
    }
}
