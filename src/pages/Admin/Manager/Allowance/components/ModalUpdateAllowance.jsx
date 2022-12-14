import { useEffect, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Grid, InputAdornment, TextField } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import axios from 'axios'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import schema from '../validation'
import Constants from '@/components/Constants'
import NumberFormat from 'react-number-format'

function ModalUpdateAllowance({ title, selectedData, isOpen, handleClose, handleConfirm, isEdit }) {
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
        const newObj = {
            ...selectedData,
            content: data.description,
            money: data.money,
            typeOfAllowance: data.name
        }
        axios
            .put(Constants.baseAPI + 'api/allowance', newObj)
            .then((res) => {
                toast.success(res.data.message)
                handleClose && handleClose()
            })
            .catch((error) => {
                console.log(error)
            })
    }

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
                <Grid container sx={{ mt: 1 }} spacing={2}>
                    <Grid item xs={6}>
                        <Box>
                            <TextField
                                fullWidth
                                size="small"
                                id="outlined-basic"
                                label="T??n"
                                variant="outlined"
                                defaultValue={selectedData.typeOfAllowance}
                                {...register('name')}
                                error={errors.name ? true : false}
                                helperText={errors.name?.message}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={6} sx={{ '& .MuiTextField-root': { mb: 3 } }}>
                        <Box>
                            <Controller
                                name="money"
                                variant="outlined"
                                defaultValue={selectedData.money}
                                control={control}
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <NumberFormat
                                        name="money"
                                        size="small"
                                        customInput={TextField}
                                        label="Gi?? b??n"
                                        thousandSeparator={true}
                                        variant="outlined"
                                        defaultValue={selectedData.money}
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
                    </Grid>
                    <Grid item xs={12}>
                        <Box>
                            <TextField
                                disabled={!isEdit}
                                fullWidth
                                multiline
                                rows={6}
                                size="small"
                                id="outlined-basic"
                                label="N???i dung"
                                variant="outlined"
                                defaultValue={selectedData.content}
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

export default ModalUpdateAllowance
