import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Grid, MenuItem, TextField } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import AccountApi from '@/api/AccountApi'
import provincesApi from '@/api/provincesApi'
import schema from '../validation'

export default function ModelAddStaffAccount({ title, isOpen, handleClose, handleConfirm, isEdit}) {
    
    const [role, setRole] = useState(null)
    const [provinceList, setProvinceList] = useState([])
    const [districtList, setDistrictList] = useState([])
    const [wardList, setWardList] = useState([])
    const [selectedProvince, setSelectedProvince] = useState(1)
    const [selectedDistrict, setSelectedDistrict] = useState(1)
    const [selectedWard, setSelectedWard] = useState(1)
    const [gender, setGender] = useState(null)

    const roleList = [
        {
            id: 1,
            name: "CUSTOMER"
        },
        {
            id: 2,
            name: "FIXER"
        },
        {
            id: 3,
            name: "SELLER"
        },
        {
            id: 4,
            name: "MANAGER"
        }
    ]

    const genderList = [
        {
            id: 0,
            name: "Nu",
            value: true
        },
        {
            id: 1,
            name: "Nam",
            value: false
        }
    ]
    const {
        register,
        handleSubmit,
        control,
        resetField,
        formState: { errors }
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema)
    })

    const onSubmit = async (data) => {
        console.log(data)
        const provinceName = await provincesApi.getProvinceById(Number(data.province))
        const districtName = await provincesApi.getDistrictById(Number(data.district))
        const wardName = await provincesApi.getWardsById(Number(data.ward))
        const dataSubmit = {
            ...data,
            province: { id: Number(data.province), name: provinceName },
            district: { id: Number(data.district), name: districtName },
            ward: { id: Number(data.ward), name: wardName },
            roles: [role],
            gender: gender
        }
        AccountApi
            .createAccount(dataSubmit)
            .then((res) => {
                console.log(res)
                toast.success('Th??m Tai Khoan Thanh Cong')
                handleConfirm && handleConfirm(true)
                handleClose && handleClose()
            })
            .catch((error) => {
                console.log(error)
            })
    }
    const getAllProvince = async () => {
        try {
            const response = await provincesApi.getAllProvince()
            setProvinceList(response.data)
        } catch (error) {
            console.log(error)
        }
    }
    const getAllDistrictByProvinceId = async (provinceId) => {
        try {
            const response = await provincesApi.getAllDistrictByProvinceId(provinceId)
            setDistrictList(response.data.districts)
        } catch (error) {
            console.log(error)
        }
    }

    const getAllWardsByDistrictId = async (districtId) => {
        try {
            const response = await provincesApi.getAllWardsByDistrictId(districtId)
            setWardList(response.data.wards)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAllProvince()
    }, [])
    useEffect(() => {
        getAllDistrictByProvinceId(selectedProvince)
        resetField('district')
        resetField('ward')
    }, [selectedProvince])
    useEffect(() => {
        getAllWardsByDistrictId(selectedDistrict)
        resetField('ward')
    }, [selectedDistrict])

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            maxWidth="sm">
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2, display: 'flex', gap: '20px'}}>
                    <TextField
                        fullWidth
                        size="small"
                        id="outlined-basic"
                        label="Ho"
                        variant="outlined"
                        {...register('firstName')}
                        error={errors.name ? true : false}
                        helperText={errors.firstName?.message}
                        placeholder="Nhap Ho"
                    />
                    <TextField
                        fullWidth
                        size="small"
                        id="outlined-basic"
                        label="Ten Dem"
                        variant="outlined"
                        {...register('middleName')}
                        error={errors.middleName ? true : false}
                        helperText={errors.middleName?.message}
                        placeholder="Nh???p Ten dem"
                    />
                    <TextField
                        fullWidth
                        size="small"
                        id="outlined-basic"
                        label="Ten"
                        variant="outlined"
                        {...register('lastName')}
                        error={errors.lastName ? true : false}
                        helperText={errors.lastName?.message}
                        placeholder="Nh???p Ten"
                    />
                </Box>
                <Box sx={{ mt: 2}}>
                    <TextField
                        fullWidth
                        size="small"
                        id="outlined-basic"
                        label="Ten dang nhap"
                        variant="outlined"
                        {...register('username')}
                        error={errors.username ? true : false}
                        helperText={errors.username?.message}
                        placeholder="Ten Dang Nhap"
                    />
                </Box>
                <Box sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        size="small"
                        id="outlined-basic"
                        label="Email"
                        variant="outlined"
                        {...register('email')}
                        error={errors.email ? true : false}
                        helperText={errors.email?.message}
                        placeholder="Email"
                    />
                </Box>
                <Box sx={{ mt: 2, display: 'flex', gap: '20px' }}>
                    <TextField
                        fullWidth
                        size="small"
                        id="outlined-basic"
                        label="So dien thoai"
                        variant="outlined"
                        {...register('phone')}
                        error={errors.phone ? true : false}
                        helperText={errors.phone?.message}
                        placeholder="So dien thoai"
                    />
                    <TextField
                        fullWidth
                        id="outlined-basic"
                        select
                        size="small"
                        label="Gioi tinh"
                        value={gender}
                        onChange={(event) => {
                            console.log(event.target.value)
                            setGender(event.target.value)
                        
                        }}
                    >
                        {genderList.map((gender) => {
                            return (
                                <MenuItem key={gender.id} value={gender.value}>
                                    {gender.name}
                                </MenuItem>
                            )
                        })}
                    </TextField>
                    
                </Box>
                <Box sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        id="outlined-basic"
                        select
                        size="small"
                        label="Chuc vu"
                        value={role}
                        onChange={(event) => {
                            console.log(event.target.value)
                            setRole(event.target.value)
                        
                        }}
                    >
                        {roleList.map((role) => {
                            return (
                                <MenuItem key={role.id} value={role.name}>
                                    {role.name}
                                </MenuItem>
                            )
                                })}
                    </TextField>
                </Box>
                <Box sx={{ mt: 2 }}>
                    <Controller
                        name="province"
                        variant="outlined"
                        defaultValue=""
                        control={control}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <TextField
                                fullWidth
                                id="outlined-select-currency"
                                select
                                size="small"
                                label="T???nh/Th??nh ph???"
                                value={value}
                                onChange={(event) => {
                                    console.log(event.target.value)
                                    setSelectedProvince(event.target.value)
                                    onChange(Number(event.target.value))
                                }}
                                sx={{ mr: 2 }}
                                error={!!error}
                                helperText={error ? error.message : null}
                            >
                                {provinceList.map((province) => {
                                    return (
                                        <MenuItem key={province.code} value={province.code}>
                                            {province.name}
                                        </MenuItem>
                                    )
                                })}
                            </TextField>
                        )}
                        />
                </Box>

                <Box sx={{ mt: 2 }}>
                    <Controller
                        name="district"
                        variant="outlined"
                        defaultValue=""
                        control={control}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <TextField
                                fullWidth
                                id="outlined-select-currency"
                                select
                                size="small"
                                label="Qu???n/Huy???n"
                                value={value}
                                onChange={(event) => {
                                    setSelectedDistrict(event.target.value)
                                    onChange(Number(event.target.value))
                                }}
                                sx={{ mr: 2 }}
                                error={!!error}
                                helperText={error ? error.message : null}>
                                {districtList.map((district) => {
                                    return (
                                        <MenuItem key={district.code} value={district.code}>
                                            {district.name}
                                        </MenuItem>
                                    )
                                })}
                            </TextField>
                        )}
                    />
                </Box>

                <Box sx={{ mt: 2 }}>
                    <Controller
                        name="ward"
                        variant="outlined"
                        defaultValue=""
                        control={control}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <TextField
                                fullWidth
                                id="outlined-select-currency"
                                select
                                size="small"
                                label="Ph?????ng/X??"
                                value={value}
                                onChange={(event) => {
                                    setSelectedWard(event.target.value)
                                    onChange(Number(event.target.value))
                                }}
                                sx={{ mr: 2 }}
                                error={!!error}
                                helperText={error ? error.message : null}>
                                {wardList.map((ward) => {
                                    return (
                                        <MenuItem key={ward.code} value={ward.code}>
                                            {ward.name}
                                        </MenuItem>
                                    )
                                })}
                            </TextField>
                        )}
                    />
                </Box>

                <Box sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        size="small"
                        id="outlined-basic"
                        label="?????a ch??? c??? th???"
                        placeholder="T??a nh??, t??n ???????ng ..."
                        variant="outlined"
                        {...register('address')}
                        error={errors.address ? true : false}
                        helperText={errors.address?.message}
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