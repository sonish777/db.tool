import { Card, Grid } from '@mui/material';
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
import { axiosInstance } from 'utils';
import { getPaginationURLParams } from 'utils';

function CheckConstraint() {
    const columnHelper = createColumnHelper();
    const columns = [
        columnHelper.accessor('constraint_name', {
            header: 'Constraint Name',
            cell: ({ getValue }) => getValue() || 'N/A',
        }),
        columnHelper.accessor('constraint_type', {
            header: 'Constraint Type',
            cell: ({ getValue }) => getValue() || 'N/A',
        }),
        columnHelper.accessor('constraint_code', {
            header: 'Constraint Definition',
            cell: ({ getValue }) =>
                getValue() ? (
                    <pre>
                        <code>{getValue()}</code>
                    </pre>
                ) : (
                    'N/A'
                ),
        }),
        columnHelper.accessor('column_names', {
            header: 'Parent Table',
            cell: ({ getValue, row }) => {
                const value = getValue();
                const tableName = row.original.table_name;
                if (value && value.length) {
                    return value.map((col) => (
                        <>
                            <Link
                                style={{ color: 'blueviolet' }}
                                to={'/tables/' + tableName}
                            >
                                {tableName}
                            </Link>
                            .{col}
                        </>
                    ));
                }
            },
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
        const fetchConstraints = async () => {
            const paginationQuery = getPaginationURLParams(pagination);
            const response = await axiosInstance.get(
                `/constraints/check?${paginationQuery}`
            );
            setRows(response.data.data);
            setPageCount(response.data.meta.pagination.totalPages);
            setTotal(response.data.meta.pagination.total);
        };
        fetchConstraints();
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
                                Check Constraints
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

export default CheckConstraint;
