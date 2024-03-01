import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Slide } from '@mui/material';
import * as React from 'react'
import { api } from '../../../../api/api';
import { useForm } from 'react-hook-form'
import './note.css'


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function NoteForm({ setLoader, open, setOpen, carrier, setAlertInfo, setCurrCarrier }) {
    const { register, handleSubmit } = useForm({ defaultValues: { note: carrier?.note } })

    const handleClose = () => {
        setOpen(false);
        setCurrCarrier(null)
    };

    const handleSave = (form_data) => {
        api(`/api/carriers/${carrier.id}/`, 'PATCH', form_data).then((res) => {
            setAlertInfo({ open: true, color: 'success', message: res.data.message })
            setLoader(true)
        })
    }

    return (
        <React.Fragment>

            <Dialog
                className='carrier_note_dialog'
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <form onSubmit={handleSubmit(handleSave)}>
                    <DialogTitle>{"Примечание к клиенту"}</DialogTitle>

                    <DialogContent>
                    {carrier &&
                        <TextField {...register('note')} defaultValue={carrier?.note} multiline minRows={4} className='note_field_client' label="Примечание" variant="filled" />
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