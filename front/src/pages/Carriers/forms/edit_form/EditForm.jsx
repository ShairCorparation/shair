import * as React from 'react'
import { Grid, Dialog, DialogTitle, DialogContent, DialogActions, Button, Slide, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { api } from '../../../../api/api';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditForm({ open, setOpen, carrier, setAlertInfo, setLoader, setCurrCarrier }) {
    const { register, formState: { errors }, handleSubmit } = useForm()
    const [carrierInfo, setCarrierInfo] = React.useState(null)

    const handleSave = (form_date) => {
        api(`/api/carriers/${carrier}/`, 'PATCH', form_date).then((res) => {
            setAlertInfo({ open: true, color: 'success', message: res.data.message })
            setLoader(true)
        })
    }

    const handleClose = () => {
        setOpen(false);
        setCurrCarrier(null)
    };

    // React.useEffect(() => {
    //     if (carrier) {
    //         api(`/api/carriers/${carrier}`).then((res) => {
    //             setCarrierInfo(res.data)
    //             console.log(res.data)
    //         })
    //     }
    // }, [])


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
                        {carrier &&
                            <Grid container p={0} spacing={1}>
                                <Grid item xs={12} md={6} mt={1}>
                                    <TextField {...register('company_name')} defaultValue={carrier?.company_name} fullWidth type="text" label="Название компании" variant='standard' />
                                </Grid>
                                <Grid item xs={12} md={6} mt={1}>
                                    <TextField {...register('contact_person')} defaultValue={carrier?.contact_person} fullWidth label="Контактное лицо" variant='standard' />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField {...register('unp')} defaultValue={carrier?.unp} fullWidth label="УНП клиента" variant='standard' />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField {...register('contact_info')} defaultValue={carrier?.contact_info} fullWidth label="Контактная информация" variant='standard' />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField {...register('note')} defaultValue={carrier?.note} multiline minRows={4} fullWidth label="Примечание" variant='standard' />
                                </Grid>
                            </Grid>
                        }
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color='error'>Отмена</Button>
                        <Button type='submit' color='success'>Сохранить</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </React.Fragment>
    )
}