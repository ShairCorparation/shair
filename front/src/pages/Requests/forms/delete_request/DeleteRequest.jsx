import {
    Grid, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { api } from '../../../../api/api';
import '../take_to_job/take_to_job.css'


export default function DeleteRequest({ setOpen, open, currentReq, setLoader, setAlertInfo, setCurrentReq, point = '' }) {
    const { handleSubmit } = useForm()

    const handleClose = () => {
        setOpen(false);
        setCurrentReq(null)
    };

    const handleSave = () => {
        const data = { status: 'archived', }
        if (point === '') {
            api(`/api/requests/${currentReq.id}/`, 'DELETE')
                .then((res) => {
                    setAlertInfo({ open: open, color: 'secondary', message: res.data.message })
                    setLoader(true)
                    setOpen(false)
                })
                .catch((err) => {
                    setAlertInfo({ open: open, color: 'error', message: err.response.data.unp[0] })
                })
        }
        else {
            if (currentReq.payment_from_carrier && currentReq.payment_from_client) {
                api(`/api/requests/${currentReq.id}/`, 'PATCH', data).then((res) => {
                    setAlertInfo({ open: open, color: 'secondary', message: 'Запрос был помещен в архив!' })
                    setLoader(true)
                    setOpen(false)
                })
            }
            else {
                setAlertInfo({ open: open, color: 'error', message: 'Не проведена оплата по клиенту или перевозчику!' })
            }
        }
    }


    return (
        <Dialog
            maxWidth={'500px'}
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <form onSubmit={handleSubmit(handleSave)} className='form_take_to_job'>
                <DialogTitle id="alert-dialog-title">
                    {'Удаление '} {point === '' ? 'запроса' : 'заказа'}
                </DialogTitle>
                <DialogContent>
                    <Grid container >

                        <Grid item xs={12} pt={1}>
                            <Typography variant='body1'>Вы уверены что хотите удалить {point === '' ? 'запрос' : 'заказ'}?</Typography>
                        </Grid>

                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button type='submit' variant='outlined' color='error'>Удалить {point === '' ? 'запрос' : 'заказ'}</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

