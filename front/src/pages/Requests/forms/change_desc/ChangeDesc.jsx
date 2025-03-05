import {
    Grid, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField
} from '@mui/material'
import FormError from '../../../../components/FormError/FormError';
import { useForm } from 'react-hook-form'
import { api } from '../../../../api/api';
import '../take_to_job/take_to_job.css'


export default function ChangeDesc({ setOpen, open, currentReq, setLoader, setAlertInfo, setCurrentReq, purpose = '' }) {
    const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onSubmit' })

    const handleClose = () => {
        setOpen(false);
        setCurrentReq(null)
    };

    const handleSave = (form_data) => {
        const data = { note: form_data.note, }
        api(`/api/requests/${currentReq.id}/`, 'PATCH', data)
            .then((res) => {
                setAlertInfo({ open: open, color: 'success', message: res.data.message })
                setOpen(false)
                currentReq.note = form_data.note
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
                    {"Редактирование примечания"}
                </DialogTitle>
                <DialogContent>
                    <Grid container >

                        <Grid item xs={12} pt={1}>
                            <TextField type="number" size='small'
                                multiline
                                minRows={4}
                                fullWidth
                                label="Примечание"
                                placeholder="Примечание"
                                defaultValue={currentReq && currentReq.note}
                                {...register('note', {
                                    required: true,
                                })}
                            />
                            <FormError error={errors?.note} />
                        </Grid>

                    </Grid>
                </DialogContent>
                {purpose !== 'archive' &&
                    <DialogActions>
                        <Button type='submit' variant='outlined' color='success'>Обновить примечание</Button>
                    </DialogActions>
                }
            </form>

        </Dialog>
    )
}

