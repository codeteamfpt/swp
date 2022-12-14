import providerApi from '@/api/providerApi'
import provincesApi from '@/api/provincesApi'
import uploadApi from '@/api/uploadApi'
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
import schema from '../validation'
import ImageUpload from './ImageUpload'

export default function ModalAddProvider({ title, isOpen, handleClose, handleConfirm, isEdit }) {
    const [provinceList, setProvinceList] = useState([])
    const [districtList, setDistrictList] = useState([])
    const [wardList, setWardList] = useState([])
    const [selectedProvince, setSelectedProvince] = useState(1)
    const [selectedDistrict, setSelectedDistrict] = useState(1)
    const [selectedWard, setSelectedWard] = useState(1)
    const [imageData, setImageData] = useState(null)

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
        console.log(imageData?.photoMainName)
        const formData = new FormData()
        formData.append('file', imageData?.photoMainName)
        uploadApi.uploadImage(formData).then(async (res) => {
            console.log('up anh thanh cong', res.data.data[0])
            const provinceName = await provincesApi.getProvinceById(Number(data.province))
            const districtName = await provincesApi.getDistrictById(Number(data.district))
            const wardName = await provincesApi.getWardsById(Number(data.ward))
            const dataSubmit = {
                ...data,
                province: { id: Number(data.province), name: provinceName },
                district: { id: Number(data.district), name: districtName },
                ward: { id: Number(data.ward), name: wardName },
                image: res.data.data[0],
            }
            providerApi
                .createProvider(dataSubmit)
                .then((res) => {
                    console.log(res)
                    toast.success('Th??m th??nh c??ng nh?? cung c???p')
                    handleConfirm && handleConfirm(true)
                    handleClose && handleClose()
                })
                .catch((error) => {
                    console.log(error)
                })
            console.log(dataSubmit)
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
            maxWidth="md">
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>

            <DialogContent>
                <Grid container sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                        {/* Upload image */}
                        <ImageUpload onSubmit={(images) => setImageData(images)} />
                    </Grid>
                    <Grid item xs={6} sx={{ '& .MuiTextField-root': { mb: 3 } }}>
                        <Box>
                            <TextField
                                fullWidth
                                size="small"
                                id="outlined-basic"
                                label="T??n"
                                variant="outlined"
                                {...register('name')}
                                error={errors.name ? true : false}
                                helperText={errors.name?.message}
                            />
                        </Box>

                        <Box>
                            <TextField
                                fullWidth
                                size="small"
                                id="outlined-basic"
                                label="Email"
                                variant="outlined"
                                {...register('email')}
                                error={errors.email ? true : false}
                                helperText={errors.email?.message}
                            />
                        </Box>

                        <Box>
                            <TextField
                                fullWidth
                                size="small"
                                id="outlined-basic"
                                label="S??? ??i???n tho???i"
                                variant="outlined"
                                {...register('phone')}
                                error={errors.phone ? true : false}
                                helperText={errors.phone?.message}
                            />
                        </Box>

                        <Box>
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
                                            setSelectedProvince(event.target.value)
                                            onChange(Number(event.target.value))
                                        }}
                                        sx={{ mr: 2 }}
                                        error={!!error}
                                        helperText={error ? error.message : null}>
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

                        <Box>
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

                        <Box>
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

                        <Box>
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

                        <Box>
                            <TextField
                                fullWidth
                                multiline
                                rows={6}
                                maxRows={10}
                                size="small"
                                id="outlined-basic"
                                label="N???i dung"
                                variant="outlined"
                                {...register('description')}
                                error={errors.description ? true : false}
                                helperText={errors.description?.message}
                            />
                        </Box>
                    </Grid>
                </Grid>
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
