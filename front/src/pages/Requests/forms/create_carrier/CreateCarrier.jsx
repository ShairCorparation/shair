import {
    Grid, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton,
    FormControl, InputLabel, MenuItem, Select, Autocomplete, TableContainer, Table, TableBody, TableCell, Paper, TableHead, TableRow
} from '@mui/material'
import ErrorMessage from '../../../../components/ErrorMesage/ErrorMesage';
import FormError from '../../../../components/FormError/FormError';
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { api } from '../../../../api/api';
import DeleteIcon from '@mui/icons-material/Delete';

export default function CreateCarrier({ setOpen, open, request, setCurrentReq, setLoader }) {
    const { register, reset, handleSubmit, formState: { errors } } = useForm({ mode: 'onSubmit' })
    const [alertInfo, setAlertInfo] = useState({ open: false, color: '', message: '' });
    const [carriers, setCarriers] = useState([])
    const [currentCarrier, setCurrentCarrier] = useState(null)
    const [requestCarriers, setRequestCarriers] = useState([])


    const fetch_carriers = () => {
        api('/api/carriers/').then(res => setCarriers(res.data))
    }

    const fetch_request_carriers = () => {
        api('/api/request_carriers/', 'GET', {}, false, {
            params: {
                'request_id': request.id
            }
        }).then(res => {
            setRequestCarriers(res.data)
        })
    }

    useEffect(() => {
        fetch_carriers()
        fetch_request_carriers()
    }, [])

    const handleClose = () => {
        setOpen(false);
        setCurrentReq(null)
    };

    const put_in_request = () => {
        if (currentCarrier) {
            api('/api/request_carriers/', 'POST',
                {
                    'request_id': request.id,
                    'carrier_id': currentCarrier
                }).then(res => {
                    setAlertInfo({ open: open, color: 'success', message: res.data.message })
                    fetch_request_carriers()
                    setLoader(true)
                }).catch((err) => {
                    setAlertInfo({ open: open, color: 'error', message: 'Перевозчик уже добавлен в данный запрос' })
                })
        }
    }

    const delete_carrier = (id) => {

        api(`/api/request_carriers/${id}/`, 'DELETE').then(res => {
            setAlertInfo({ open: open, color: 'success', message: res.data.message })
            fetch_request_carriers()
            setLoader(true)
        })
    }

    const handleSave = (form_data) => {
        api('/api/carriers/', 'POST', form_data)
            .then((res) => {
                reset()
                setLoader(true)
                setAlertInfo({ open: open, color: 'success', message: res.data.message })
                fetch_carriers()
            })
            .catch((err) => {
                setAlertInfo({ open: open, color: 'error', message: err.response.data.unp[0] })
            })
    }

    const update_carrier = (e, field, id) => {
        if (e.target.value !== '') {
            api(`/api/request_carriers/${id}/`, 'PATCH', { [field]: e.target.value }).then(res => {
                setAlertInfo({ open: open, color: 'success', message: res.data.message })
                setLoader(true)
            })
        }
    }

    return (
        <Dialog
            maxWidth={'500px'}
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <form onSubmit={handleSubmit(handleSave)}>
                <DialogTitle id="alert-dialog-title">
                    {"Добавление перевозчика"}
                </DialogTitle>
                <DialogContent>
                    <Grid container>
                        <Grid container mb={1} mt={1} spacing={1} xs={12} justifyContent={'center'}>
                            <Grid item xs={12} md={4}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    fullWidth
                                    size='small'
                                    getOptionLabel={(option) => `${option.company_name} ${option.contact_person}`}
                                    onChange={(e, v) => {
                                        setCurrentCarrier(v?.id)
                                    }}
                                    options={carriers}
                                    renderInput={(params) => <TextField  {...params} label="Перевозчики" />}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Button variant={'contained'} onClick={put_in_request} color='success'>Добавить в запрос</Button>
                            </Grid>

                        </Grid>
                        <Grid container xs={12} md={6} p={1}>
                            <Grid item xs={12}>
                                <TableContainer component={Paper}>
                                    <Table aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="left">Название компании</TableCell>
                                                <TableCell align="left">Конт лицо</TableCell>
                                                <TableCell align="left">Рейт</TableCell>
                                                <TableCell align="left">Валюта</TableCell>
                                                <TableCell align="left"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>

                                            {requestCarriers.map(item => (
                                                <TableRow>
                                                    <TableCell align="left">{item.company_name}</TableCell>
                                                    <TableCell align="left">{item.contact_person}</TableCell>
                                                    <TableCell align="left">
                                                        <TextField
                                                            required
                                                            type='number'
                                                            size='small'
                                                            id="outlined-required"
                                                            onInput={(e) => {
                                                                update_carrier(e, 'carrier_rate', item.id)
                                                            }}
                                                            defaultValue={item.carrier_rate}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <FormControl fullWidth size='small'>
                                                            <InputLabel id="demo-simple-select-label">Валюта</InputLabel>
                                                            <Select
                                                                labelId="demo-simple-select-label"
                                                                id="demo-simple-select"
                                                                defaultValue={item.carrier_currency}
                                                                label="Age"
                                                                onChange={(e) => update_carrier(e, 'carrier_currency', item.id)}
                                                            >
                                                                <MenuItem value={'BYN'}>BYN</MenuItem>
                                                                <MenuItem value={"RUB"}>RUB</MenuItem>
                                                                <MenuItem value={'EUR'}>EUR</MenuItem>
                                                                <MenuItem value={'USD'}>USD</MenuItem>
                                                            </Select>
                                                        </FormControl>

                                                    </TableCell>

                                                    <TableCell>
                                                        <IconButton aria-label="delete" className='btn_table'
                                                            onClick={() => {
                                                                delete_carrier(item.id)
                                                            }}
                                                        >
                                                            <DeleteIcon color='error' />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}

                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} xs={12} md={6} p={1} alignContent={'flex-start'}>
                            <Grid item xs={12} >
                                <TextField type="text" size='small'
                                    fullWidth
                                    label="Наименование компании"
                                    placeholder="Наименование компании"
                                    {...register('company_name', {
                                        required: true,
                                    })}
                                />
                                <FormError error={errors?.company_name} />
                            </Grid>

                            <Grid item xs={12} >
                                <TextField type="text" size='small'
                                    fullWidth
                                    label="Контактное лицо"
                                    placeholder="Контактное лицо"
                                    {...register('contact_person', {
                                        required: true,
                                    })}
                                />
                                <FormError error={errors?.contact_person} />
                            </Grid>

                            <Grid item xs={12} >
                                <TextField type="text" size='small'
                                    fullWidth
                                    label="УНП"
                                    placeholder="УНП"
                                    {...register('unp', {
                                        required: true,
                                    })}
                                />
                                <FormError error={errors?.unp} />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField type="text" size='small'
                                    fullWidth
                                    label="Контактная информация"
                                    placeholder="Контактная информация"
                                    {...register('contact_info', {
                                        required: true,
                                    })}
                                />
                                <FormError error={errors?.contact_info} />
                            </Grid>

                            <Grid item xs={12} >
                                <TextField type="number" size='small'
                                    fullWidth
                                    label="Ставка"
                                    placeholder="Ставка"
                                    {...register('rate', {
                                        required: true,
                                    })}
                                />
                                <FormError error={errors?.rate} />
                            </Grid>

                            <Grid item xs={12} mb={1}>
                                <FormControl sx={{ width: '100%' }} size="small">
                                    <InputLabel id="demo-simple-select-label">Валюта</InputLabel>
                                    <Select

                                        className="select_field_edit_page"
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Валюта"
                                        {...register('currency', { required: true })}
                                    >
                                        <MenuItem value={'USD'}>USD</MenuItem>
                                        <MenuItem value={'EUR'}>EUR</MenuItem>
                                        <MenuItem value={'BYN'}>BYN</MenuItem>
                                        <MenuItem value={'RUB'}>RUB</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormError error={errors?.currency} />
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button type='submit' variant='outlined' color='success'>Создать перевозчика</Button>

                </DialogActions>
            </form>
            <ErrorMessage alertInfo={alertInfo} setAlertInfo={setAlertInfo} />
        </Dialog>
    )
}

