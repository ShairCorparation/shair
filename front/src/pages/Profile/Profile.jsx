import { Grid, Typography, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { api, removeStorageAndGoToLogin } from '../../api/api';
import ErrorMessage from '../../components/ErrorMesage/ErrorMesage';
import AddNewUser from './forms/AddNewUser';
import ChangePassword from './forms/ChangePassword';


export default function Profile() {
    const [alertInfo, setAlertInfo] = useState({ open: false, color: '', message: '' });

    const [user, setUser] = useState(null)

    useEffect(() => {
        api(`/auth/users_info/current_user/`).then((res) => {
            setUser(res.data)
        })
    }, [])

    const logout = () => {
        api(`/auth/logout/`, 'POST', {refresh: localStorage.getItem('refresh_token')}).then(()=> {
            removeStorageAndGoToLogin()
        })
        
    }

    return (
        <Grid container xs={12} p={1} justifyContent='center'>
            <Grid container p={1} mb={1} xs={12} justifyContent='space-evenly'>
                <Grid item >
                    <Typography variant='h5'>Добро пожаловать, {user?.first_name} {user?.last_name}!</Typography>
                </Grid>
                <Grid item>
                    <Button onClick={logout} color='primary' variant='contained'>Выйти из системы</Button>
                </Grid>
            </Grid>
            <ChangePassword setAlertInfo={setAlertInfo} />
            {user?.is_staff && <AddNewUser setAlertInfo={setAlertInfo} currentUser={user}/>}


            <ErrorMessage alertInfo={alertInfo} setAlertInfo={setAlertInfo} />
        </Grid>
    )
}