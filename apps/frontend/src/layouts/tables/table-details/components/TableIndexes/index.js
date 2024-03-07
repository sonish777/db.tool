import { Card, Chip, Grid, Tooltip } from '@mui/material';
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
import { getPaginationURLParams } from 'utils';
import KeyIcon from '@mui/icons-material/Key';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { axiosInstance } from 'utils';

function TableIndexes({ tableName }) {
    const columnHelper = createColumnHelper();
    const columns = [
        columnHelper.accessor('indexname', {
            header: 'Index Name',
            cell: ({ getValue, row }) => {
                if (
                    row.original.index_category?.toUpperCase() === 'PRIMARY KEY'
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
                    row.original.index_category?.toUpperCase() === 'UNIQUE KEY'
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
                } else {
                    return (
                        <Tooltip title="Performance">
                            <div>
                                <VpnKeyIcon style={{ color: 'orangered' }} />
                                {'  '}
                                {getValue()}
                            </div>
                        </Tooltip>
                    );
                }
            },
        }),
        columnHelper.accessor('indextype', {
            header: 'Index Type',
            cell: ({ getValue }) => getValue() || 'N/A',
        }),
        columnHelper.accessor('columns', {
            header: 'Indexed Columns',
            cell: ({ getValue }) =>
                getValue()
                    .split(',')
                    .map((col) => (
                        <Chip color="primary" label={col} size="small" />
                    )) || 'N/A',
        }),
        columnHelper.accessor('indexdef', {
            header: 'Index Definition',
            cell: ({ getValue }) => (
                <pre>
                    <code>{getValue()}</code>
                </pre>
            ),
        }),
        columnHelper.accessor('index_category', {
            header: 'Index Category',
            cell: ({ getValue }) => getValue() || 'N/A',
        }),
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
                `/tables/${tableName}/indexes?${paginationQuery}`
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
                                Indexes
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

export default TableIndexes;
