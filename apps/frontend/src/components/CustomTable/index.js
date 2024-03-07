import { TableContainer, Table, TableRow, TableBody } from '@mui/material';
import { flexRender } from '@tanstack/react-table';
import MDBox from 'components/MDBox';
import DataTableBodyCell from 'examples/Tables/DataTable/DataTableBodyCell';
import DataTableHeadCell from 'examples/Tables/DataTable/DataTableHeadCell';

export function CustomTable({ table }) {
    return (
        <TableContainer sx={{ boxShadow: 'none' }}>
            <Table>
                <MDBox component="thead">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <DataTableHeadCell
                                    key={header.id}
                                    width={
                                        header.column.width
                                            ? header.column.width
                                            : 'auto'
                                    }
                                    align={
                                        header.column.align
                                            ? header.column.align
                                            : 'left'
                                    }
                                >
                                    {header.isPlaceholder ? null : (
                                        <div>
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </div>
                                    )}
                                </DataTableHeadCell>
                            ))}
                        </TableRow>
                    ))}
                </MDBox>
                <TableBody>
                    {table.getRowModel().rows.map((row) => {
                        return (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell, key) => (
                                    <DataTableBodyCell
                                        key={cell.id}
                                        align={
                                            cell.column.align
                                                ? cell.column.align
                                                : 'left'
                                        }
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </DataTableBodyCell>
                                ))}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
