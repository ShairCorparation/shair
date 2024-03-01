import * as React from 'react';
import {Dialog, DialogTitle, DialogContent, DialogActions, Button, Slide, Typography} from '@mui/material'
import { api } from '../../../../api/api';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

export default function DeleteForm({open, setOpen, carrier, setLoader, setAlertInfo, setCurrClient}){

    const handleClose = () => {
        setOpen(false);
        setCurrClient(null)
      };

    function handleSave() {
        api(`/api/carriers/${carrier?.id}/`, 'DELETE').then((res) => {
            setAlertInfo({open: true, color: 'secondary', message: res.data.message})
            handleClose()
            setLoader(true)
        })
    }

    return (
        <React.Fragment>

        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Вы уверены что хотите удалить перевозчика?"}</DialogTitle>
          <DialogContent>
            <Typography variant='body1'>
            {carrier.company_name} - {carrier.contact_person}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Отмена</Button>
            <Button onClick={handleSave} color='error' variant='contained'>Удалить</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
}