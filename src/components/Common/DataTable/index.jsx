import SearchIcon from '@mui/icons-material/Search'
import { Box, InputAdornment, Paper } from '@mui/material'
import { DataGrid, GridToolbarQuickFilter } from '@mui/x-data-grid'
import clsx from 'clsx'
import { useState } from 'react'
import CustomNoRowsOverlay from './CustomNoRowsOverLay'

function DataTable({ columns, rows, children, titleSearch }) {
    const [pageSize, setPageSize] = useState(15)
    function QuickSearchToolbar() {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                }}>
                <GridToolbarQuickFilter
                    InputProps={{
                        sx: { border: 1 },
                        autoComplete: 'off',
                        startAdornment: <InputAdornment position="start"></InputAdornment>,
                        endAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        )
                    }}
                    placeholder={titleSearch ? titleSearch : 'Tìm kiếm'}
                    quickFilterParser={(searchInput) =>
                        searchInput
                            .split(',')
                            .map((value) => value.trim())
                            .filter((value) => value !== '')
                    }
                />
                {children}
            </Box>
        )
    }

    return (
        <Paper style={{ display: 'flex', height: '100%' }}>
            <Box sx={{ flexGrow: 1, p: 2 }}>
                <DataGrid
                    sx={{
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: 'rgba(230, 134, 86, 0.3)'
                        },
                        '& .MuiDataGrid-toolbarContainer': {
                            backgroundColor: 'rgba(230, 134, 86, 0.3)'
                        },
                        p: 2,
                        maxHeight: '90%'
                    }}
                    className={clsx('table')}
                    disableColumnFilter
                    disableColumnSelector
                    disableDensitySelector
                    // checkboxSelection
                    disableSelectionOnClick={true}
                    rows={rows}
                    columns={columns}
                    // pageSize={pageSize}
                    pageSize={pageSize}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    rowsPerPageOptions={[15, 30, 50]}
                    components={{
                        Toolbar: QuickSearchToolbar,
                        NoRowsOverlay: CustomNoRowsOverlay
                    }}
                />
            </Box>
        </Paper>
    )
}

export default DataTable
