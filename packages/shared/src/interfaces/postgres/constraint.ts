export interface KeyConstraint {
    table_name: string;
    column_names: string[];
    constraint_type: string;
    constraint_name: string;
    constraint_code: string;
    referenced_table: string;
    referenced_columns: string[];
    update_rule: string;
    delete_rule: string;
}

export interface CheckConstraint {
    table_name: string;
    column_names: string[];
    constraint_type: string;
    constraint_name: string;
    constraint_code: string;
}
