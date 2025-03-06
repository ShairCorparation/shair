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

