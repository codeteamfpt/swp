import TimeKeepingApi from '@/api/TimeKeepingApi'
import DataTable from '@/components/Common/DataTable'
import { Button, Tooltip } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import ModalTimeKeeping from './components/ModalTimeKeeping'

function TimeKeepingTab({ value, index, periodCode }) {
    const [isOpenTimeKeepingModal, setIsOpenTimeKeepingModal] = useState(false)
    const [timeSheetDetail, setTimeSheetDetail] = useState([])
    const [employee, setEmployee] = useState({})
    const [isRender, setIsRender] = useState(true)

    const getTimeSheetDetail = async (period_code) => {
        try {
            const response = await TimeKeepingApi.getTimeSheetDetails(period_code)
            console.log(response)
            if (response.data.length > 0) {
                console.log('getTimeSheetDetail - ', response.data)
                setTimeSheetDetail(response.data)
            } else {
                const res = await TimeKeepingApi.createTimeSheetDetails(period_code)
                console.log('createTimeSheetDetails - ', res.data)
                setTimeSheetDetail(res.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const sendEmail = async (periodCode) => {
        try {
            const response = await TimeKeepingApi.sendEmailTimeSheetDetail(periodCode)
            toast.success(response.message)
        } catch (error) {
            console.log('Failed when send email')
        }
    }

    const handleSendEmail = () => {
        sendEmail(periodCode)
    }

    useEffect(() => {
        getTimeSheetDetail(periodCode)
    }, [periodCode])

    useEffect(() => {
        isRender && getTimeSheetDetail(periodCode)
        setIsRender(false)
    }, [timeSheetDetail, isRender])

    const handleAction = (params) => {
        setEmployee(params)
        setIsOpenTimeKeepingModal(true)
    }

    const columns = [
        { field: 'employee', headerName: 'S??? th??? t???', flex: 0.5, hide: true },
        { field: 'id', headerName: 'S??? th??? t???', flex: 0.5 },
        { field: 'name', headerName: 'T??N', flex: 1 },
        {
            field: 'roles',
            headerName: 'VAI TR??',
            flex: 1,
            cellClassName: 'roles'
        },
        {
            field: 'allowedDay',
            headerName: 'NGH??? PH??P',
            flex: 1
        },
        { field: 'absentDay', headerName: 'V???NG', flex: 1 },
        { field: 'holidaysWorking', headerName: 'C??NG L???', flex: 1 },
        { field: 'weekendWorking', headerName: 'C??NG CU???I TU???N', flex: 1 },
        // { field: 'workingDay', headerName: 'NG??Y TH?????NG', flex: 1 },
        { field: 'totalDayWorking', headerName: 'T???NG S??? NG??Y L??M VI???C', flex: 1 },
        {
            field: 'actions',
            headerName: 'T??C V???',
            flex: 1,
            renderCell: (params) => {
                return (
                    <>
                        <Tooltip title="L??m th??m">
                            <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleAction(params.row)}>
                                {/* <EditRounded fontSize="inherit" /> */}
                                Ch???m c??ng
                            </Button>
                        </Tooltip>
                    </>
                )
            }
        }
    ]
    const rows = timeSheetDetail.map((item, index) => {
        const container = {}
        container['id'] = index + 1
        container['absentDay'] = item.absentDay
        container['allowedDay'] = item.allowedAbsentDay
        container['holidaysWorking'] = item.holidaysWorking
        container['periodCode'] = item.periodCode
        container['totalDayWorking'] = item.totalDayWorking
        container['weekendWorking'] = item.weekendWorking
        container['workingDay'] = item.workingDay
        container['employee'] = item.employee
        container['name'] =
            (item.employee.firstName  || '') +' '+(item.employee.middleName || '') + ' '+ (item.employee.lastName || '')
        container['roles'] = item.employee.roles[0].name
        return container
    })

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}>
            {isOpenTimeKeepingModal && employee && (
                <ModalTimeKeeping
                    isOpen={isOpenTimeKeepingModal}
                    title={'Ch???m c??ng'}
                    handleClose={() => {
                        setIsOpenTimeKeepingModal(false)
                        setIsRender(true)
                    }}
                    employee={employee}
                    timeSheetDetail={timeSheetDetail}
                />
            )}

            <Box
                sx={{
                    height: '65vh',
                    '& .roles .MuiDataGrid-cellContent': {
                        backgroundColor: '#DEE1E6FF',
                        borderRadius: 2,
                        p: 1
                    }
                }}>
                <Button variant="contained" onClick={() => handleSendEmail()} autoFocus>
                    G???i ch???m c??ng
                </Button>
                <DataTable columns={columns} rows={rows} />
            </Box>
        </div>
    )
}

export default TimeKeepingTab
