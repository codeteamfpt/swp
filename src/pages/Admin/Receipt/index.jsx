import orderApi from '@/api/orderApi'
import DataTable from '@/components/Common/DataTable'
import ConfirmModal from '@/components/Common/Modal/ConfirmModal'
import { EditRounded, Visibility } from '@mui/icons-material'
import ClearRoundedIcon from '@mui/icons-material/ClearRounded'
import { Breadcrumbs, Button, IconButton, Link, Stack, Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import moment from 'moment/moment'
import { useReactToPrint } from 'react-to-print'
import ReceiptPrint from './components/ReceiptPrint'

function Receipt() {
    const navigate = useNavigate()
    const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false)
    const [isOpenPrintModal, setIsOpenPrintModal] = useState(false)
    const [selectedRow, setSelectedRow] = useState(null)
    const [listProducts, setListProducts] = useState([])
    const [isRender, setIsRender] = useState(true)
    const componentRef = useRef()

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Invoice'
    })

    const handleDelete = async () => {
        try {
            await orderApi.deleteOrderT(selectedRow?.id)
            toast.success('Xóa thành công !')
            setIsOpenConfirmModal(false)
            setIsRender(true)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const getAllProduct = async (status) => {
            try {
                const response = await orderApi.getAllOrder(status)
                setListProducts(response.data)
                if (response.data.length > 0) setSelectedRow(response.data[0])
            } catch (error) {
                console.log('fail when getAllProduct', error)
            }
        }
        isRender && getAllProduct(3)
        setIsRender(false)
    }, [listProducts, isRender])

    const columns = [
        { field: 'id', headerName: 'ID', flex: 1, hide: true },
        {
            field: 'customerName',
            headerName: 'TÊN KHÁCH HÀNG',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => {
                return (
                    params.row.customer.firstName +
                    ' ' +
                    params.row.customer.middleName +
                    ' ' +
                    params.row.customer.lastName
                )
            }
        },
        {
            field: 'phone',
            headerName: 'SỐ ĐIỆN THOẠI',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => {
                return params.row.customer.phone
            }
        },
        {
            field: 'createdBy',
            headerName: 'NGƯỜI TẠO',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => {
                return params.row.employeeSale.username
            }
        },
        {
            field: 'totalOrderPrice',
            headerName: 'TỔNG HÓA ĐƠN',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueFormatter: (params) => {
                if (params.value == null) {
                    return ''
                }
                return `${params.value.toLocaleString('vi-VN')} VND`
            }
        },
        {
            field: 'dateCreated',
            headerName: 'NGÀY TẠO',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            type: 'number',
            valueFormatter: (params) => {
                if (params.value == null) {
                    return ''
                }
                return moment(params.value).format('DD/MM/YYYY HH:MM')
            }
        },

        {
            field: 'actions',
            headerName: 'TÁC VỤ',
            flex: 1.5,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => {
                return (
                    <>
                        <Tooltip title="Xem">
                            <IconButton
                                aria-label="view"
                                size="small"
                                onClick={() => {
                                    navigate(`/admin/receipts/details/${params.row.id}`)
                                }}>
                                <Visibility />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                            <IconButton
                                aria-label="view"
                                size="small"
                                onClick={() => {
                                    setSelectedRow(params.row)
                                    setIsOpenConfirmModal(true)
                                }}>
                                <ClearRoundedIcon fontSize="inherit" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="XUẤT">
                            <IconButton
                                aria-label="view"
                                size="small"
                                onClick={() => {
                                    setSelectedRow(params.row)
                                    setIsOpenPrintModal(true)
                                    // handlePrint()
                                    // console.log(params)
                                }}>
                                <EditRounded fontSize="inherit" />
                            </IconButton>
                        </Tooltip>
                    </>
                )
            }
        }
    ]
    return (
        <>
            <ConfirmModal
                isOpen={isOpenConfirmModal}
                title="Xác nhận"
                content={`Bạn có muốn xóa hóa đơn này không?`}
                handleClose={() => setIsOpenConfirmModal(false)}
                handleConfirm={() => handleDelete()}
            />
            <ConfirmModal
                isOpen={isOpenPrintModal}
                title="Xác nhận"
                content={`Bạn có muốn in hóa đơn này không?`}
                handleClose={() => setIsOpenPrintModal(false)}
                handleConfirm={() => {
                    handlePrint()
                    setIsOpenPrintModal(false)
                }}
            />
            <Stack
                direction="row"
                sx={{
                    height: 75,
                    justifyContent: 'space-between',
                    backgroundColor: 'white',
                    p: 2,
                    mb: 1,
                    alignItems: 'center'
                }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" color="inherit" href="/">
                        Đổi hộ
                    </Link>
                    <Link
                        underline="hover"
                        color="inherit"
                        href="/material-ui/getting-started/installation/">
                        Đổi hộ
                    </Link>
                    <Typography color="text.primary">Đổi hộ</Typography>
                </Breadcrumbs>
            </Stack>

            <DataTable
                titleSearch="Đổi cái place holder này "
                columns={columns}
                rows={listProducts}
                children={
                    <Button
                        variant="contained"
                        onClick={() => navigate('../receipts/createReceipt')}>
                        Thêm hóa đơn
                    </Button>
                }
            />
            {selectedRow && (
                <Box ref={componentRef}>
                    <ReceiptPrint data={selectedRow} />
                </Box>
            )}
        </>
    )
}

export default Receipt
