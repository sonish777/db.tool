import { Card, Grid, Tooltip } from '@mui/material';
import {
    createColumnHelper,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { CustomTable } from 'components/CustomTable';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import { TablePagination } from 'components/TablePagination';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPaginationURLParams } from 'utils';
import KeyIcon from '@mui/icons-material/Key';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { axiosInstance } from 'utils';

function TableColumns({ tableName }) {
    const columnHelper = createColumnHelper();
    const columns = [
        columnHelper.accessor('column_name', {
            header: 'Column Name',
            cell: ({ getValue, row }) => {
                if (
                    row.original.constraint_type?.toUpperCase() ===
                    'PRIMARY KEY'
                ) {
                    return (
                        <Tooltip title="Primary Key">
                            <div>
                                <KeyIcon style={{ color: 'goldenrod' }} />
                                {'  '}
                                {getValue()}
                            </div>
                        </Tooltip>
                    );
                } else if (
                    row.original.constraint_type?.toUpperCase() ===
                    'FOREIGN KEY'
                ) {
                    return (
                        <Tooltip title="Foreign Key">
                            <div>
                                <VpnKeyIcon style={{ color: 'skyblue' }} />
                                {'  '}
                                {getValue()}
                            </div>
                        </Tooltip>
                    );
                } else if (
                    row.original.constraint_type?.toUpperCase() === 'UNIQUE'
                ) {
                    return (
                        <Tooltip title="Unique Key">
                            <div>
                                <VpnKeyIcon style={{ color: 'grey' }} />
                                {'  '}
                                {getValue()}
                            </div>
                        </Tooltip>
                    );
                }
                return getValue();
            },
        }),
        columnHelper.accessor('data_type', {
            header: 'Type',
            cell: ({ getValue }) => getValue() || 'N/A',
        }),
        columnHelper.accessor('character_maximum_length', {
            header: 'Size',
            cell: ({ getValue }) => getValue() || 'N/A',
        }),
        { header: 'Nullable', accessorKey: 'is_nullable' },
        columnHelper.accessor('column_default', {
            header: 'Default',
            cell: ({ getValue }) =>
                getValue() ? (
                    <pre>
                        <code>{getValue()}</code>
                    </pre>
                ) : (
                    'N/A'
                ),
        }),
        columnHelper.accessor(
            (row) =>
                row.referenced_table
                    ? `${row.referenced_table}.${row.referenced_column_name}`
                    : 'N/A',
            {
                id: 'referenced_table',
                cell: ({ getValue }) => {
                    const value = getValue();
                    if (value.split('.').length === 2) {
                        const [tableName, columnName] = getValue().split('.');
                        return (
                            <>
                                <Link
                                    style={{ color: 'blueviolet' }}
                                    to={'/tables/' + tableName}
                                >
                                    {tableName}
                                </Link>
                                .{columnName}
                            </>
                        );
                    }
                    return value;
                },
                header: 'Referenced Table',
            }
        ),
    ];

    const [rows, setRows] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5,
    });
    const [pageCount, setPageCount] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchTableColumns = async () => {
            const paginationQuery = getPaginationURLParams(pagination);
            const response = await axiosInstance.get(
                `/columns/${tableName}?${paginationQuery}`
            );
            setRows(response.data.data);
            setPageCount(response.data.meta.pagination.totalPages);
            setTotal(response.data.meta.pagination.total);
        };
        fetchTableColumns();
    }, [pagination, tableName]);

    const table = useReactTable({
        columns,
        data: rows,
        pageCount: pageCount,
        state: {
            pagination,
        },
        onPaginationChange: setPagination,
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <MDBox pt={6} pb={3}>
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <Card>
                        <MDBox
                            mx={2}
                            mt={-3}
                            py={3}
                            px={2}
                            variant="gradient"
                            bgColor="info"
                            borderRadius="lg"
                            coloredShadow="info"
                        >
                            <MDTypography variant="h6" color="white">
                                Columns
                            </MDTypography>
                        </MDBox>
                        <MDBox pt={3}>
                            <CustomTable table={table} />
                            <div className="h-2" />
                            <TablePagination
                                table={table}
                                pagination={pagination}
                                totalRows={rows.length}
                                pageCount={pageCount}
                                total={total}
                            />
                        </MDBox>
                    </Card>
                </Grid>
            </Grid>
        </MDBox>
    );
}

export default TableColumns;
