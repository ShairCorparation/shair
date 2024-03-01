import { Grid, Paper, Typography, TextField, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import FormError from '../../../components/FormError/FormError';
import { api } from '../../../api/api';

export default function ChangePassword({ setAlertInfo }) {
    const { register, formState: { errors }, handleSubmit } = useForm()

    const handleSave = (form_data) => {
        api(`/auth/users_info/change_password/`, 'PATCH', form_data).then((res) => {
            setAlertInfo({open: true, color: 'success', message: res.data.message})
        })
    }

    return (
        <Grid container item xs={12} md={6} p={2} justifyContent='center' alignItems='baseline'>
            
            <Grid item component={Paper} mt={2} mb={2} xs={12} >
                <form onSubmit={handleSubmit(handleSave)}>
                    <Grid container p={3} spacing={1}>
                        <Grid item xs={12} align='center'>
                            <Typography variant='h6'>Смена пароля</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField type="text" size='small'
                                fullWidth
                                label="Новый пароль"
                                placeholder="Новый пароль"
                                {...register('password', {
                                    required: true,
                                    pattern: {
                                        value: /.*([a-z]+[A-Z]+[0-9]+|[a-z]+[0-9]+[A-Z]+|[A-Z]+[a-z]+[0-9]+|[A-Z]+[0-9]+[a-z]+|[0-9]+[a-z]+[A-Z]+|[0-9]+[A-Z]+[a-z]+).*/,
                                        message: 'Пароль должен состоять из символов нижнего и верхнего регистров, латинских букв, цифр и спец знаков!'
                                    },
                                    minLength: {
                                        value: 8,
                                        message: 'Пароль должен состоять как минимум из 8 знаков!'
                                    }
                                })}
                            />
                            <FormError error={errors?.password} />
                        </Grid>
                        <Grid item xs={12} align='end'>
                            <Button color='success' type='submit' variant='contained'>Обновить пароль</Button>
                        </Grid>
                    </Grid>
                </form>
                
            </Grid>
            
        </Grid>
    )
}