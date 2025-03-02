import {
    Grid, Typography, Paper, TextField, Button, TableContainer, Table, TableCell, Tooltip, IconButton,
    TableRow, TableBody, TableHead, Checkbox
} from '@mui/material';
import FormError from '../../../components/FormError/FormError';
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm } from 'react-hook-form';
import { api } from '../../../api/api';
import { useEffect, useState } from 'react'
import Loader from '../../components/Loader'


export default function AddNewUser({ setAlertInfo, currentUser }) {
    const { register, formState: { errors }, handleSubmit } = useForm()
    const [users, setUsers] = useState(null)
    const [mode, setMode] = useState(false)
    const [loader, setLoader] = useState(true)

    const get_users = async () => {
        await api(`/auth/users_info/`).then((res) => {
            setUsers(res.data)
            setLoader(false)
        })
    }

    const get_profile = async () => {
        await api(`/auth/profile/`, 'GET', {}, false, { params: { 'user_id': currentUser.id } }).then(res => {
            setMode(res.data.is_logistics)
        })
    }

    useEffect(() => {
        const fetch_data = async () => {
            await get_profile()
            await get_users()
        }
        fetch_data()
    }, [])

    const handleChange = (e) => {
        setMode(e.target.checked)
        api(`/auth/profile/${currentUser.id}/`, 'PATCH', { 'is_logistics': e.target.checked }).then(() => {
        })
    }

    const handleSave = (form_data) => {
        api(`/auth/register/`, 'POST', form_data).then(() => {
            setAlertInfo({ open: true, color: 'success', message: 'Сотрудник был успешно создан!' })
            setLoader(true)
            get_users()
        }).catch((err) => {

        })
    }

    const handleDelete = (user_id) => {
        api(`/auth/users_info/${user_id}/`, 'DELETE').then(() => {
            setAlertInfo({ open: true, color: 'secondary', message: 'Сотрудник был успешно удален!' })
            setLoader(true)
            get_users()
        })
    }

    return (
        <Grid container item xs={12} md={6} p={2} justifyContent='center'>

            <Grid item component={Paper} mt={2} mb={2} xs={12}>
                <form onSubmit={handleSubmit(handleSave)}>

                    <Grid container p={3} spacing={1}>
                        <Grid container item xs={12} align="left" alignItems={'center'}>
                            <Grid item >
                                <Checkbox checked={mode} onChange={handleChange} />
                            </Grid>
                            <Grid item >
                                <Typography>режим логиста</Typography>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} align='center'>
                            <Typography variant='h6'>Создание нового сотрудника</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField type="text" size='small'
                                fullWidth
                                label="Логин"
                                placeholder="Логин"
                                {...register('username', {
                                    required: true,
                                })}
                            />
                            <FormError error={errors?.username} />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField type="text" size='small'
                                fullWidth
                                label="Пароль"
                                placeholder="Пароль"
                                {...register('password', {
                                    required: true,
                                    minLength: {
                                        value: 8,
                                        message: 'Пароль должен состоять как минимум из 8 знаков!'
                                    }
                                }
                                )}
                            />
                            <FormError error={errors?.password} />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField type="text" size='small'
                                fullWidth
                                label="Имя"
                                placeholder="Имя"
                                {...register('first_name', {
                                    required: true,
                                })}
                            />
                            <FormError error={errors?.first_name} />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField type="text" size='small'
                                fullWidth
                                label="Фамилия"
                                placeholder="Фамилия"
                                {...register('last_name', {
                                    required: true,
                                })}
                            />
                            <FormError error={errors?.last_name} />
                        </Grid>

                        <Grid item xs={12} align='end'>
                            <Button type='submit' color='success' variant='contained'>Создать</Button>
                        </Grid>
                    </Grid>
                </form>
            </Grid>

            <Grid item component={Paper} xs={12} position={'relative'}>
                {loader ? <Loader />
                    : <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Имя</TableCell>
                                    <TableCell align="left">Фамилия</TableCell>
                                    <TableCell align="left"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users && users?.map((user) => (
                                    !user?.is_staff &&
                                    <TableRow key={user.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row"> {user.first_name}</TableCell>
                                        <TableCell align="left">{user.last_name}</TableCell>
                                        <TableCell align="left">
                                            <Tooltip title="Удалить">
                                                <IconButton aria-label="delete"
                                                    onClick={() => handleDelete(user.id)}
                                                >
                                                    <DeleteIcon color='error' />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                }
            </Grid>
        </Grid>

    )
}