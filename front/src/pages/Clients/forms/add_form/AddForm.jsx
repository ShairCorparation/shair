import { Grid, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import { useForm } from 'react-hook-form'
import { api } from '../../../../api/api';
import FormError from '../../../../components/FormError/FormError';

export default function AddForm({setLoader, open, setOpen, setAlertInfo }) {
    const { register, reset, handleSubmit, formState: {errors} } = useForm({ mode: 'onSubmit' })

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = (form_data) => {
        api('/api/clients/', 'POST', form_data)
        .then((res) => {
            reset()
            setLoader(true)
            setAlertInfo({open: true, color: 'success', message: res.data.message})
        })
        .catch((err) => {
            setAlertInfo({open: true, color: 'error', message: err.response.data.message})
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
                    {"Создание нового клиента"}
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
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button type='submit' variant='outlined' color='success'>Сохранить</Button>

                </DialogActions>
            </form>
        </Dialog>
    )
}

