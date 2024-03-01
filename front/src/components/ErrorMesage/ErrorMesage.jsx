import {Snackbar, Alert} from '@mui/material'


export default function ErrorMessage({alertInfo, setAlertInfo}) {

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertInfo({...alertInfo, open:false});
    };    

    return (
        <Snackbar
            open={alertInfo.open}
            autoHideDuration={2000}
            onClose={handleClose}
            message="Note archived"
        >
            <Alert severity={alertInfo.color}>{alertInfo.message}</Alert>
        </Snackbar>
    )
}