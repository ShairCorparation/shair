import { Grid, Paper, Typography, TextField, Button, FormControl, InputLabel, OutlinedInput, 
    InputAdornment, IconButton } from '@mui/material'
import { useForm } from 'react-hook-form'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ErrorMessage from '../../../components/ErrorMesage/ErrorMesage';
import axios from 'axios';
import {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import './login.css'


export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onSubmit' })
    const [alertInfo, setAlertInfo] = useState({open: false, color: '', message: ''});
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleLogin = (form_date) => {
        axios.post(`${process.env.REACT_APP_API_DEV}/auth/login/`, 
        form_date)
        .then((res) => {
            localStorage.setItem('access_token', res.data.tokens['access'])
            localStorage.setItem('refresh_token', res.data.tokens['refresh'])
            navigate('/')
        })
        .catch(() => {
            setAlertInfo({open: true, color: 'error', message: 'Логин или пароль введены неверно!'})
        })
        
    }

    return (
        <Grid container sx={{height: 'inherit'}} justifyContent='center' alignItems='baseline'>
            <Grid container item xs={12} md={6} lg={4} m={1} sx={{marginTop: {xs:'50%', sm: '15%'}}} component={Paper}>
                <Grid item xs={12} align='center' p={2} className='auth_text_container'>
                        <Typography>Авторизация</Typography>
                 </Grid>
                <form onSubmit={handleSubmit(handleLogin)} className='login_form'>
                    

                    <Grid item xs={12} p={1} mt={1}>
                        <TextField
                            size='small'
                            sx={{ 'background': 'white' }}
                            fullWidth
                            {...register('username', {
                                required: 'Поле с именем пользователя должно быть заполненым.',  
                            })}
                            id="filled-required"
                            label="Имя пользователя"
                            variant="outlined"
                        />

                    </Grid>

                    <Grid item xs={12} p={1}>
                    <FormControl sx={{ m: 0, width: '100%' }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password" className='password_field'>Пароль</InputLabel>
                    <OutlinedInput
                        fullWidth
                        size='small'
                        id="outlined-adornment-password"
                        sx={{ 'background': 'white', }}
                        type={showPassword ? 'text' : 'password'}
                        {...register('password', {
                            required: 'Поле пароля является обязательным!',
                            minLength: {
                                value: 4,
                                message: 'Пароль должен состоять минимум из 4 знаков!'
                            }
                        })}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Password"
                    />
                </FormControl>
                    </Grid>

                    <Grid item xs={12} p={1} align='end'>
                        <Button variant='outlined' color='success' type='submit'>Войти</Button>
                    </Grid>
                </form>
                <ErrorMessage alertInfo={alertInfo} setAlertInfo={setAlertInfo} />
            </Grid>
        </Grid>
    )
}