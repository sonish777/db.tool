import { Icon, MenuItem, Pagination, Select } from '@mui/material';
import MDBox from 'components/MDBox';
import MDPagination from 'components/MDPagination';
import MDTypography from 'components/MDTypography';

export function TablePagination({
    table,
    pagination,
    totalRows,
    pageCount,
    total,
}) {
    const { pageIndex, pageSize } = pagination;
    // Setting the entries starting point
    const entriesStart =
        pageIndex === 0 ? pageIndex + 1 : pageIndex * pageSize + 1;

    // Setting the entries ending point
    let entriesEnd;

    if (pageIndex === 0) {
        entriesEnd = totalRows;
    } else if (pageIndex === pageCount - 1) {
        entriesEnd = totalRows;
    } else {
        entriesEnd = pageSize * (pageIndex + 1);
    }

    const onPageClickHandler = (_e, page) => {
        table.setPageIndex(page - 1);
    };

    return (
        <MDBox
            display="flex"
            flexDirection={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{
                xs: 'flex-start',
                sm: 'center',
            }}
            p={3}
        >
            <MDBox mb={{ xs: 3, sm: 0 }}>
                <MDTypography
                    variant="button"
                    color="secondary"
                    fontWeight="regular"
                >
                    Showing {entriesStart} to {entriesEnd} of {total} entries
                </MDTypography>
            </MDBox>
            <MDBox display="flex" alignItems="center">
                <MDTypography
                    variant="button"
                    color="secondary"
                    fontWeight="regular"
                    mr={1}
                >
                    Rows per page:
                </MDTypography>
                <Select
                    sx={{ minWidth: 40, height: 32 }}
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                        table.setPageSize(Number(e.target.value));
                    }}
                >
                    {[5, 10, 20, 30, 40, 50].map((pSize) => (
                        <MenuItem
                            selected={pageSize === pSize}
                            key={pSize}
                            value={pSize}
                        >
                            {pSize}
                        </MenuItem>
                    ))}
                </Select>
            </MDBox>

            <MDPagination variant="gradient" color="info">
                <MDPagination
                    item
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <Icon
                        sx={{
                            fontWeight: 'bold',
                        }}
                    >
                        chevron_left
                    </Icon>
                </MDPagination>
                <Pagination
                    hideNextButton
                    hidePrevButton
                    count={pageCount}
                    color="primary"
                    onChange={onPageClickHandler}
                    page={pageIndex + 1}
                />
                <MDPagination
                    item
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <Icon
                        sx={{
                            fontWeight: 'bold',
                        }}
                    >
                        chevron_right
                    </Icon>
                </MDPagination>
            </MDPagination>
        </MDBox>
    );
}
