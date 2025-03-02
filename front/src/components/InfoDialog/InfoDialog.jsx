import * as React from 'react'
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material'

const TEXTS = {
    'complete_order': { title: 'Завершение сделки', question: 'Вы уверены что хотите завершить эту сделку?' },
    'set_receive_doc': {title: 'Документы получены заказчиком', question: 'Вы уверены что хотите установить новый статус?'}
}

export default function InfoDialog({ open, setOpen, successFunc, textType, name=null }) {
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
                    {`${TEXTS[textType]['title']} ${name ? name : ''}`}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {TEXTS[textType]['question']}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color='error'>Отмена</Button>
                    <Button onClick={successFunc} color='success' autoFocus>
                        Подвердить
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}