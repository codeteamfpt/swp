import authApi from '@/api/authApi'
import contractApi from '@/api/contractApi'
import { yupResolver } from '@hookform/resolvers/yup'
import { Autocomplete, Box, InputAdornment, MenuItem, TextField } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { vi } from 'date-fns/locale'
import moment from 'moment/moment'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import NumberFormat from 'react-number-format'
import { toast } from 'react-toastify'
import schema from '../validation'

export default function ModalAddContract({ title, isOpen, handleClose, handleConfirm }) {
    const [selectedEmployee, setSelectedEmployee] = useState([])
    const [startDate, setStartDate] = useState()
    const [contractTerm, setContractTerm] = useState(1)
    const [userList, setUserList] = useState([])

    const handleChange = (event, value) => setSelectedEmployee(value)
    const {
        register,
        handleSubmit,
        control,
        formState: { errors }
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema)
    })
    const onSubmit = (data) => {
        console.log(data)
        const dataSubmit = {
            ...data,
            employee: selectedEmployee,
            contractTerm: contractTerm,
            startDate: moment(data.startDate).format('YYYY-MM-DD'),
            endDate: moment(getEndDateBycontractTerm(contractTerm)).format('YYYY-MM-DD')
        }
        contractApi
            .createContract(dataSubmit)
            .then((res) => {
                console.log(res.data.data)
                if (res.data.data.length) {
                    console.log(res)
                    toast.success(res.data.message)
                    handleConfirm && handleConfirm(true)
                    handleClose && handleClose()
                } else {
                    console.log(res)
                    toast.error(res.data.message)
                    handleConfirm && handleConfirm(true)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const months = () => {
        let months = []
        for (let i = 1; i <= 12; i++) {
            months.push({ label: i + ' th??ng', value: i })
        }
        return months
    }
    const getEndDateBycontractTerm = (contractTerm) => {
        if (startDate) {
            return new Date(
                startDate.getFullYear(),
                startDate.getMonth() + Number(contractTerm),
                startDate.getDate()
            )
        } else {
            return null
        }
    }

    useEffect(() => {
        const getUserInternal = async () => {
            try {
                const response = await authApi.getUserInternal()
                console.log('getUserInternal', response.data)
                setUserList(response.data)
            } catch (error) {
                console.log('fail at getUserInternal', error)
            }
        }
        getUserInternal()
    }, [])

    useEffect(() => {
        console.log(selectedEmployee)
    }, [selectedEmployee])
    useEffect(() => {
        console.log(startDate)
    }, [startDate])

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            maxWidth="md">
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            {/* { selectedOptions } */}
            <DialogContent>
                <Box sx={{ mt: 1, display: 'flex', gap: '16px' }}>
                    {userList && (
                        <Autocomplete
                            id="tags-outlined"
                            options={userList}
                            getOptionLabel={(option) =>
                                `${option.id} - ${option.firstName} ${option.middleName} ${option.lastName}`
                            }
                            onChange={handleChange}
                            filterSelectedOptions
                            fullWidth
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    size="small"
                                    label="Ch???n nh??n vi??n"
                                    {...register('name')}
                                    error={errors.name ? true : false}
                                    helperText={errors.name?.message}
                                />
                            )}
                        />
                    )}
                    {/* <TextField
                        fullWidth
                        size="small"
                        id="outlined-basic"
                        type="number"
                        label="S??? l???n k??"
                        variant="outlined"
                        {...register('signTimes')}
                        error={errors.signTimes ? true : false}
                        helperText={errors.signTimes?.message}
                    /> */}
                    <Controller
                        name="salary"
                        variant="outlined"
                        defaultValue=""
                        control={control}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <NumberFormat
                                name="salary"
                                size="small"
                                customInput={TextField}
                                label="L????ng"
                                thousandSeparator={true}
                                variant="outlined"
                                defaultValue=""
                                value={value}
                                onValueChange={(v) => {
                                    onChange(Number(v.value))
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">VND</InputAdornment>
                                    )
                                }}
                                error={!!error}
                                helperText={error ? error.message : null}
                                fullWidth
                            />
                        )}
                    />
                </Box>

                <Box sx={{ mt: 3, display: 'flex', gap: '16px' }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                        <Box sx={{ width: '100%' }}>
                            <Controller
                                required
                                name="startDate"
                                control={control}
                                defaultValue=""
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <DatePicker
                                        label="Ng??y b???t ?????u"
                                        // disablePast
                                        ampm={false}
                                        value={value}
                                        // onChange={(value) => onChange(value)}
                                        // value={new Date(datePlayerDeadline)}
                                        onChange={(value) => {
                                            onChange(value)
                                            setStartDate(value)
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                sx={{
                                                    marginTop: '0px !important',
                                                    marginBottom: '16px !important'
                                                }}
                                                {...params}
                                                required
                                                id="outlined-disabled"
                                                error={!!error}
                                                helperText={error ? error.message : null}
                                                // id="startDate"
                                                variant="outlined"
                                                margin="dense"
                                                fullWidth
                                                size="small"
                                            />
                                        )}
                                    />
                                )}
                            />
                        </Box>
                        <TextField
                            fullWidth
                            select
                            size="small"
                            id="outlined-basic"
                            label="Th???i h???n"
                            value={contractTerm}
                            onChange={(event) => {
                                setContractTerm(event.target.value)
                            }}
                            variant="outlined">
                            {months().map((i) => (
                                <MenuItem key={i.value} value={i.value}>
                                    {i.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        {startDate && (
                            <TextField
                                fullWidth
                                size="small"
                                id="outlined-basic"
                                value={moment(getEndDateBycontractTerm(contractTerm)).format(
                                    'DD/MM/YYYY'
                                )}
                                label="Ng??y k???t th??c"
                                variant="outlined"
                                placeholder="Nh???p n???i dung"
                                {...register('endDate')}
                                error={errors.endDate ? true : false}
                                helperText={errors.endDate?.message}
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                        )}
                    </LocalizationProvider>
                </Box>

                <Box sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        multiline
                        rows={6}
                        maxRows={10}
                        size="small"
                        id="outlined-basic"
                        label="M?? t???"
                        variant="outlined"
                        placeholder="Nh???p n???i dung"
                        {...register('content')}
                        error={errors.content ? true : false}
                        helperText={errors.content?.message}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>H???y b???</Button>
                <Button onClick={handleSubmit(onSubmit)} autoFocus>
                    ?????ng ??
                </Button>
            </DialogActions>
        </Dialog>
    )
}
