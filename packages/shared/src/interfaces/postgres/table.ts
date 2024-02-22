export interface InformationSchema_Table {
    table_catalog: string;
    table_schema: string;
    table_name: string;
    table_type: string;
    self_referencing_column_name: string | null;
    reference_generation: string | null;
    user_defined_type_catalog: string | null;
    user_defined_type_schema: string | null;
    user_defined_type_name: string | null;
    is_insertable_into: 'YES' | 'NO';
    is_typed: 'YES' | 'NO';
    commit_action: string | null;
}

export interface TableStats {
    table_name: string;
    table_type: string;
    n_tup_ins: number;
    n_tup_upd: number;
    n_tup_del: number;
    n_live_tup: number;
    total?: number;
}
