import TimeKeepingApi from '@/api/TimeKeepingApi'
import ConfirmModal from '@/components/Common/Modal/ConfirmModal'
import Constants from '@/components/Constants'
import { Box, Button, Divider, MenuItem, Tab, Tabs, TextField } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import OvertimeTab from './OvertimeTab'
import TimeKeepingTab from './TimeKeepingTab'

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    }
}

const _month = new Date().getMonth() + 1
const _year = new Date().getFullYear()

function TimeKeeping() {
    const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false)
    const [month, setMonth] = useState(_month)
    const [year, setYear] = useState(_year)
    const [value, setValue] = useState(0)
    const [timeSheetPeriods, setTimeSheetPeriods] = useState([])
    const [isRender, setIsRender] = useState(true)

    const getTimeSheetPeriods = async (period_code) => {
        try {
            const response = await TimeKeepingApi.getTimeSheetPeriods(period_code)
            console.log(response)
            setTimeSheetPeriods(response.data)
        } catch (error) {
            console.log(error)
        }
    }
    const createTimeSheetPeriods = async (month, year) => {
        try {
            const data = { month: month, periodCode: month + '' + year, year: year }
            await axios.post(Constants.baseAPI + 'api/timesheetperiods', data).then((res) => {
                console.log(res)
                setTimeSheetPeriods(res.data)
                toast.success(res.message)
            })
            setIsRender(true)
            // setTimeSheetPeriods(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        isRender && getTimeSheetPeriods(month + '' + year)
        setIsRender(false)
    }, [timeSheetPeriods])

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    const handleDelete = () => {
        toast.success('X??a th??nh c??ng !')
        setIsOpenConfirmModal(false)
    }

    return (
        <>
            <ConfirmModal
                isOpen={isOpenConfirmModal}
                title="X??c nh???n"
                content={`B???n c?? mu???n x??a k?? c??ng?`}
                handleClose={() => setIsOpenConfirmModal(false)}
                handleConfirm={() => handleDelete()}
            />
            <h2>Ch???m c??ng</h2>
            <Box sx={{ mb: 2, mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                    <TextField
                        id="outlined-select-currency"
                        select
                        size="small"
                        label="Th??ng"
                        value={month}
                        onChange={(event) => {
                            setMonth(event.target.value)
                            getTimeSheetPeriods(event.target.value + '' + year)
                        }}
                        sx={{ mr: 2 }}>
                        <MenuItem value={1}>Th??ng 1</MenuItem>
                        <MenuItem value={2}>Th??ng 2</MenuItem>
                        <MenuItem value={3}>Th??ng 3</MenuItem>
                        <MenuItem value={4}>Th??ng 4</MenuItem>
                        <MenuItem value={5}>Th??ng 5</MenuItem>
                        <MenuItem value={6}>Th??ng 6</MenuItem>
                        <MenuItem value={7}>Th??ng 7</MenuItem>
                        <MenuItem value={8}>Th??ng 8</MenuItem>
                        <MenuItem value={9}>Th??ng 9</MenuItem>
                        <MenuItem value={10}>Th??ng 10</MenuItem>
                        <MenuItem value={11}>Th??ng 11</MenuItem>
                        <MenuItem value={12}>Th??ng 12</MenuItem>
                    </TextField>
                    <TextField
                        id="outlined-select-currency"
                        select
                        size="small"
                        label="N??m"
                        value={year}
                        onChange={(event) => {
                            setYear(event.target.value)
                            getTimeSheetPeriods(month + '' + event.target.value)
                        }}>
                        <MenuItem value={2021}>2021</MenuItem>
                        <MenuItem value={2022}>2022</MenuItem>
                    </TextField>
                </Box>
                <Box>
                    <Button
                        variant="contained"
                        onClick={() => {
                            createTimeSheetPeriods(month, year)
                        }}
                        disabled={timeSheetPeriods.length > 0}
                        sx={{ mr: 2 }}>
                        T???o k?? c??ng
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            // setIsOpenAddModal(true)
                        }}
                        disabled={timeSheetPeriods.length == 0}>
                        X??a k?? c??ng
                    </Button>
                </Box>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {timeSheetPeriods.length > 0 && (
                <>
                    <Box sx={{ mb: 1 }}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            aria-label="basic tabs example"
                            centered>
                            <Tab
                                label="Ch???m c??ng"
                                {...a11yProps(0)}
                                sx={{ backgroundColor: 'white', mr: 2 }}
                            />
                            <Tab
                                label="L??m th??m"
                                {...a11yProps(1)}
                                sx={{ backgroundColor: 'white' }}
                            />
                        </Tabs>
                    </Box>
                    <TimeKeepingTab value={value} index={0} periodCode={month + '' + year} />
                    <OvertimeTab value={value} index={1} periodCode={month + '' + year} />
                </>
            )}
        </>
    )
}

export default TimeKeeping
