import { Grid, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button,
    FormControl, InputLabel, MenuItem, Select} from '@mui/material'
import ErrorMessage from '../../../../components/ErrorMesage/ErrorMesage';
import FormError from '../../../../components/FormError/FormError';
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { api } from '../../../../api/api';

export default function CreateCarrier({ setOpen, open, request, setCurrentReq, setLoader}) {
    const { register, reset, handleSubmit, formState: { errors } } = useForm({ mode: 'onSubmit' })
    const [alertInfo, setAlertInfo] = useState({ open: false, color: '', message: '' });

    const handleClose = () => {
        setOpen(false);
        setCurrentReq(null)
    };

    const handleSave = (form_data) => {
        form_data.request_id = request.id

        api('/api/carriers/', 'POST', form_data)
            .then((res) => {
                reset()
                setLoader(true)
                setAlertInfo({ open: open, color: 'success', message: res.data.message })
            })
            .catch((err) => {
                setAlertInfo({ open: open, color: 'error', message: err.response.data.unp[0] })
            })
    }

    return (
        <Dialog
            maxWidth={'500px'}
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <form onSubmit={handleSubmit(handleSave)}>
                <DialogTitle id="alert-dialog-title">
                    {"Создание нового перевозчика"}
                </DialogTitle>
                <DialogContent>
                    <Grid container >
                        <Grid item xs={12} mb={1} mt={1}>
                            <TextField type="text" size='small'
                                fullWidth
                                label="Наименование компании"
                                placeholder="Наименование компании"
                                {...register('company_name', {
                                    required: true,
                                })}
                            />
                            <FormError error={errors?.company_name} />
                        </Grid>

                        <Grid item xs={12} mb={1}>
                            <TextField type="text" size='small'
                                fullWidth
                                label="Контактное лицо"
                                placeholder="Контактное лицо"
                                {...register('contact_person', {
                                    required: true,
                                })}
                            />
                            <FormError error={errors?.contact_person} />
                        </Grid>

                        <Grid item xs={12} mb={1}>
                            <TextField type="text" size='small'
                                fullWidth
                                label="УНП"
                                placeholder="УНП"
                                {...register('unp', {
                                    required: true,
                                })}
                            />
                            <FormError error={errors?.unp} />
                        </Grid>

                        <Grid item xs={12} mb={1}>
                            <TextField type="text" size='small'
                                fullWidth
                                label="Контактная информация"
                                placeholder="Контактная информация"
                                {...register('contact_info', {
                                    required: true,
                                })}
                            />
                            <FormError error={errors?.contact_info} />
                        </Grid>

                        <Grid item xs={12} mb={1}>
                            <TextField type="number" size='small'
                                fullWidth
                                label="Ставка"
                                placeholder="Ставка"
                                {...register('rate', {
                                    required: true,
                                })}
                            />
                            <FormError error={errors?.rate} />
                        </Grid>

                        <Grid item xs={12} mb={1}>
                            <FormControl sx={{ width: '100%' }} size="small">
                                <InputLabel id="demo-simple-select-label">Валюта</InputLabel>
                                <Select

                                    className="select_field_edit_page"
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Валюта"
                                    {...register('currency', { required: true })}
                                >
                                    <MenuItem value={'USD'}>USD</MenuItem>
                                    <MenuItem value={'EUR'}>EUR</MenuItem>
                                    <MenuItem value={'BYN'}>BYN</MenuItem>
                                    <MenuItem value={'RUB'}>RUB</MenuItem>
                                </Select>
                            </FormControl>
                            <FormError error={errors?.currency} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button type='submit' variant='outlined' color='success'>Сохранить</Button>

                </DialogActions>
            </form>
            <ErrorMessage alertInfo={alertInfo} setAlertInfo={setAlertInfo} />
        </Dialog>
    )
}

