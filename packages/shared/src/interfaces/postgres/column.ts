export interface Column {
    table_name: string;
    column_name: string;
    data_type: string;
    character_maximum_length: number;
    is_nullable: 'YES' | 'NO';
    column_default: string;
    constraint_type: string;
    referenced_table: string;
    referenced_column_name: string;
}
