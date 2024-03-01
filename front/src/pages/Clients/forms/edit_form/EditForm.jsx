import * as React from 'react'
import {Grid, Dialog, DialogTitle, DialogContent, DialogActions, Button, Slide, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { api } from '../../../../api/api';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditForm({ open, setOpen, client, setAlertInfo, setLoader, setCurrClient }) {
    const { register, formState: { errors }, handleSubmit } = useForm()

    const handleSave = (form_date) => {
        api(`/api/clients/${client.id}/`, 'PATCH', form_date).then((res) => {
            setAlertInfo({ open: true, color: 'success', message: res.data.message })
            setLoader(true)
        })
    }

    const handleClose = () => {
        setOpen(false);
        setCurrClient(null)
    };

    return (
        <React.Fragment>

            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <form onSubmit={handleSubmit(handleSave)}>
                    <DialogTitle>{"Редактировать данные клиента?"}</DialogTitle>
                    <DialogContent>
                    {client && 
                        <Grid container p={0} spacing={1}>
                            <Grid item xs={12} md={6} mt={1}>
                                <TextField {...register('company_name')} defaultValue={client?.company_name} fullWidth type="text" label="Название компании" variant='filled'  />
                            </Grid>
                            <Grid item xs={12} md={6} mt={1}>
                                <TextField {...register('contact_person')} defaultValue={client?.contact_person} fullWidth label="Контактное лицо" variant='filled'  />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField {...register('unp')} defaultValue={client?.unp} fullWidth label="УНП клиента" variant='filled' />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField {...register('contact_info')} defaultValue={client?.contact_info} fullWidth label="Контактная информация" variant='filled' />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField {...register('note')} defaultValue={client?.note} multiline minRows={4} className='note_field_client' label="Примечание" variant='filled' />
                            </Grid>
                        </Grid>
                    }
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color='error'>Отмена</Button>
                        <Button  type='submit' color='success'>Сохранить</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </React.Fragment>
    )
}