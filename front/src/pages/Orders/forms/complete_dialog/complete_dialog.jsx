import * as React from 'react'
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material'
import { api } from '../../../../api/api';


export default function CompleteOrder({ open, setOpen, request, setLoader }) {

    function handleComplete() {
        api(`/api/requests/${request.id}/`, 'PATCH', {status: 'complete'}).then(()=> {
            setOpen(false)
            setLoader(true)
        })
    }

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {`Завершение сделки ${request.name_of_cargo}`}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Вы уверены что хотите завершить эту сделку?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color='error'>Отмена</Button>
                    <Button onClick={handleComplete} color='success' autoFocus>
                        Завершить сделку
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}