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
import Footer from 'examples/Footer';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import { useEffect, useState } from 'react';
import { axiosInstance } from 'utils';
import { getPaginationURLParams } from 'utils';
import KeyIcon from '@mui/icons-material/Key';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { Link } from 'react-router-dom';

function Columns() {
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
        columnHelper.accessor('table_name', {
            header: 'Table',
            cell: ({ getValue }) => (
                <Link
                    style={{ color: 'blueviolet' }}
                    to={'/tables/' + getValue()}
                >
                    {getValue()}
                </Link>
            ),
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
        columnHelper.accessor('constraint_type', {
            header: 'Constraint Type',
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
                `/columns?${paginationQuery}`
            );
            setRows(response.data.data);
            setPageCount(response.data.meta.pagination.totalPages);
            setTotal(response.data.meta.pagination.total);
        };
        fetchTableColumns();
    }, [pagination]);

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
        <DashboardLayout>
            <DashboardNavbar />
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
            <Footer />
        </DashboardLayout>
    );
}

export default Columns;
