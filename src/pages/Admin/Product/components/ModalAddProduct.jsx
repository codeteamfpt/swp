import productApi from '@/api/productApi'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Grid, InputAdornment, MenuItem, Slider, TextField, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import NumberFormat from 'react-number-format'
import { toast } from 'react-toastify'
import schema from '../validation'
import ImageUpload from './ImageUpload'

export default function ModalAddProduct({ title, isOpen, handleClose, handleConfirm, isEdit }) {
    const [provider, setProvider] = useState(1)
    const [category, setCategory] = useState(1)
    const [providerList, setProviderList] = useState([])
    const [categoryList, setCategoryList] = useState([])
    const [discountValue, setDiscountValue] = useState(30)
    const [priceOut, setPriceOut] = useState(0)
    const [imageData, setImageData] = useState(null)

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
        console.log(imageData)

        const formData = new FormData()
        formData.append('photo_main', imageData?.photoMainName)
        formData.append('photo_once', imageData?.photoOnceName)
        formData.append('photo_second', imageData?.photoSecondName)
        formData.append('photo_third', imageData?.photoThirdName)
        productApi
            .uploadImage(formData)
            .then((res) => {
                console.log('up anh thanh cong', res.data.data[0])
                const dataSubmit = {
                    ...data,
                    provider: { id: provider },
                    category: { id: category },
                    discount: discountValue,
                    productPhoto: {
                        photoMainName: res.data.data[0].photoMainName,
                        photoOnceName: res.data.data[0].photoOnceName,
                        photoSecondName: res.data.data[0].photoSecondName,
                        photoThirdName: res.data.data[0].photoThirdName
                    }
                }
                productApi
                    .createProduct(dataSubmit)
                    .then((res) => {
                        console.log(res)
                        toast.success('T???o s???n ph???m th??nh c??ng')
                        handleConfirm && handleConfirm(true)
                        handleClose && handleClose()
                    })
                    .catch((error) => console.log(error))

                console.log(dataSubmit)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const getAllCategory = async () => {
        try {
            const response = await productApi.getAllCategory()
            setCategoryList(response.data)
        } catch (error) {
            console.log('fail when getAllCategory', error)
        }
    }
    const getAllProvider = async () => {
        try {
            const response = await productApi.getAllProvider()
            setProviderList(response.data)
        } catch (error) {
            console.log('fail when getAllCategory', error)
        }
    }

    useEffect(() => {
        getAllCategory()
        getAllProvider()
    }, [])

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            maxWidth="lg">
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>

            <DialogContent>
                <Grid container sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                        {/* Upload image */}
                        <ImageUpload onSubmit={(images) => setImageData(images)} isEdit={isEdit} />
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
                                id="outlined-select-currency"
                                select
                                size="small"
                                label="Nh?? cung c???p"
                                value={provider}
                                onChange={(event) => {
                                    setProvider(event.target.value)
                                }}
                                sx={{ mr: 2 }}>
                                {providerList.map((provider) => {
                                    return (
                                        <MenuItem key={provider.id} value={provider.id}>
                                            {provider.name}
                                        </MenuItem>
                                    )
                                })}
                            </TextField>
                        </Box>

                        <Box>
                            <TextField
                                fullWidth
                                id="outlined-select-currency"
                                select
                                size="small"
                                label="Danh m???c"
                                value={category}
                                onChange={(event) => {
                                    setCategory(event.target.value)
                                }}>
                                {categoryList.map((category) => {
                                    return (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    )
                                })}
                            </TextField>
                        </Box>

                        <Box sx={{ display: 'flex', gap: '20px' }}>
                            <Controller
                                name="priceIn"
                                variant="outlined"
                                defaultValue=""
                                control={control}
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <NumberFormat
                                        name="priceIn"
                                        size="small"
                                        customInput={TextField}
                                        label="Gi?? nh???p"
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
                            <Controller
                                name="priceOut"
                                variant="outlined"
                                defaultValue=""
                                control={control}
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <NumberFormat
                                        name="priceOut"
                                        size="small"
                                        customInput={TextField}
                                        label="Gi?? b??n"
                                        thousandSeparator={true}
                                        variant="outlined"
                                        defaultValue=""
                                        value={value}
                                        onValueChange={(v) => {
                                            onChange(Number(v.value))
                                            setPriceOut(Number(v.value))
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
                        <Box sx={{ mb: 2 }}>
                            <Typography gutterBottom>Ph???n tr??m gi???m gi??</Typography>
                            <Box sx={{ display: 'flex' }}>
                                <Slider
                                    defaultValue={30}
                                    aria-label="Small"
                                    valueLabelDisplay="auto"
                                    onChange={(event, newValue) => {
                                        setDiscountValue(newValue)
                                    }}
                                />
                                <Typography sx={{ width: '50px', ml: 3 }}>
                                    {discountValue}%
                                </Typography>
                            </Box>
                        </Box>
                        <Box>
                            <Typography sx={{ mb: 1 }}>
                                <b>Gi?? b??n sau khi gi???m gi??:</b>{' '}
                                {(priceOut * ((100 - discountValue) / 100)).toLocaleString(
                                    'vi-VI'
                                ) + 'VND'}
                            </Typography>
                        </Box>
                        <Box>
                            <TextField
                                fullWidth
                                size="small"
                                id="outlined-basic"
                                label="K??ch th?????c"
                                variant="outlined"
                                {...register('size')}
                                error={errors.size ? true : false}
                                helperText={errors.size?.message}
                                // InputProps={{
                                //   endAdornment: <InputAdornment position="start">cm</InputAdornment>
                                // }}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', gap: '20px' }}>
                            <TextField
                                fullWidth
                                type="number"
                                size="small"
                                id="outlined-basic"
                                label="S??? l?????ng"
                                variant="outlined"
                                {...register('quantity')}
                                error={errors.quantity ? true : false}
                                helperText={errors.quantity?.message}
                            />
                            <TextField
                                fullWidth
                                size="small"
                                id="outlined-basic"
                                label="M??u s???c"
                                variant="outlined"
                                {...register('color')}
                                error={errors.color ? true : false}
                                helperText={errors.color?.message}
                            />
                            <TextField
                                fullWidth
                                size="small"
                                id="outlined-basic"
                                label="Ch???t li???u"
                                variant="outlined"
                                {...register('material')}
                                error={errors.material ? true : false}
                                helperText={errors.material?.message}
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
                                label="M?? t??? s???n ph???m"
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
