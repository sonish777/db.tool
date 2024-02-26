import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';

// Data
import { useEffect, useState } from 'react';
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';
import { axiosInstance } from 'utils';
import { getPaginationURLParams } from 'utils';
import { TablePagination } from 'components/TablePagination';
import { CustomTable } from 'components/CustomTable';

function Tables() {
    const columns = [
        { header: 'Table Name', accessorKey: 'table_name' },
        { header: 'Table Type', accessorKey: 'table_type' },
        { header: 'Total Rows', accessorKey: 'n_live_tup' },
        { header: 'Total Tuples Inserted', accessorKey: 'n_tup_ins' },
        { header: 'Total Tuples Updated', accessorKey: 'n_tup_upd' },
        { header: 'Total Tuples Deleted', accessorKey: 'n_tup_del' },
    ];
    const [rows, setRows] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5,
    });
    const [pageCount, setPageCount] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchTables = async () => {
            const paginationQuery = getPaginationURLParams(pagination);
            const response = await axiosInstance.get(
                `/tables?${paginationQuery}`
            );
            setRows(response.data.data);
            setPageCount(response.data.meta.pagination.totalPages);
            setTotal(response.data.meta.pagination.total);
        };
        fetchTables();
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
                                    Tables
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

export default Tables;
