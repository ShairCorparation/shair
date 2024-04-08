import {
    Grid, Card, CardContent, CardActions, CardHeader, Button, FormControl, InputLabel, Select,
    MenuItem, TextField, Paper, Typography, IconButton, DialogContent, Dialog, DialogTitle, Autocomplete
} from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { ru } from 'date-fns/locale/ru';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { useForm, Controller } from 'react-hook-form'
import CreateClient from '../create_client/CreateClient';
import * as React from 'react';
import { api } from '../../../../api/api';
import FormError from '../../../../components/FormError/FormError';
import ErrorMessage from '../../../../components/ErrorMesage/ErrorMesage';
import '../create_form/request_create.css'


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));


export default function RequestEdit({ request, openDialog, setOpenDialog, point = '', setLoader, setCurrentReq }) {
    const { register, control, handleSubmit, setValue, formState: { errors } } = useForm({ mode: 'onSubmit' })
    const [alertInfo, setAlertInfo] = React.useState({ open: false, color: '', message: '' });

    const [clients, setClients] = React.useState(null)
    const [carriers, setCarriers] = React.useState(null)
    const [req, setReq] = React.useState()
    const [open, setOpen] = React.useState(false);

    const [countries, setCountries] = React.useState()
    const [cities, setCities] = React.useState()
    const [valueCountry, setValueCountry] = React.useState()
    const [valueCity, setValueCity] = React.useState()


    const handleSave = (form_data) => {

        let delivery = form_data.date_of_delivery
        let dispatch = form_data.date_of_shipment
        form_data.date_of_delivery = `${delivery.getFullYear()}-${delivery.getMonth() + 1}-${delivery.getDate()}`
        form_data.date_of_shipment = `${dispatch.getFullYear()}-${dispatch.getMonth() + 1}-${dispatch.getDate()}`

        api(`/api/requests/${request.id}/`, 'PATCH', form_data)
            .then((res) => {
                setAlertInfo({ open: true, color: 'success', message: res.data.message })
                setLoader(true)
            })
            .catch((err) => {
            })
    }


    React.useEffect(() => {

        api('/api/clients/', 'GET').then((res) => {
            setClients(res.data)
        })

        api('/api/countries/').then((res) => {
            setCountries([...JSON.parse(res.data)['countries']])
            setCities([...JSON.parse(res.data)['cities']])
        })

        api(`/api/requests/${request.id}/`, 'GET').then((res) => {
            setReq(res.data)
            setValue('country_of_dispatch', res.data.country_of_dispatch)
            setValue('delivery_country', res.data.delivery_country)

            setValue('city_of_dispatch', res.data.city_of_dispatch)
            setValue('delivery_city', res.data.delivery_city)
        })
        if (point !== '') {
            api(`/api/carriers/${request.id}/by_request/`, 'GET').then((res) => { setCarriers(res.data) })
        }
    }, [])

    React.useEffect(() => {
        if (valueCountry) {
            const timeoutId = setTimeout(() => {
                if (!countries.includes(valueCountry)) {
                    setCountries([...countries, valueCountry])
                }
            }, 1000);
            return () => clearTimeout(timeoutId);
        }

        if (valueCity) {
            const timeoutId = setTimeout(() => {
                if (!cities.includes(valueCity)) {
                    setCities([...cities, valueCity])
                }
            }, 350);

            return () => clearTimeout(timeoutId);
        }
    }, [valueCountry, valueCity]);


    const handleClose = () => {
        setOpenDialog(false);
        setCurrentReq(null)
    };


    return (
        <Grid container justifyContent='center'>

            <BootstrapDialog
                className='dialog_container'
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={openDialog}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Обновление запроса
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers className='dialog_content'>
                    <Card sx={{ width: '90%', marginBottom: '10px', overflow: 'auto !important' }} elevation={10}>
                        <form onSubmit={handleSubmit(handleSave)} className='edit_request'>
                            <CardHeader title='Обновление запроса' align='center' sx={{ marginTop: '20px' }} />
                            {req &&
                                <CardContent>
                                    <Grid container justifyContent='center'>
                                        <Grid container item md={5.5} m={1}>
                                            <Grid container item xs={12} component={Paper}>
                                                <Grid item xs={12} pl={2} pt={1}>
                                                    <Typography variant='body1'>Общая информация</Typography>
                                                </Grid>
                                                <Grid container item xs={12} md={6} p={1}>
                                                    <Grid item xs={10}>
                                                        <FormControl sx={{ width: '100%' }} size='small'>
                                                            <InputLabel id="demo-simple-select-label">Клиент</InputLabel>
                                                            <Select
                                                                labelId="demo-simple-select-label"
                                                                id="demo-simple-select"
                                                                label="Клиент"
                                                                defaultValue={req.client.id}
                                                                {...register('client', { required: true })}
                                                            >
                                                                <MenuItem value={req.client.id}>{req.client.name}</MenuItem>
                                                                {clients && clients.map((client) => (
                                                                    <MenuItem value={client.id}>{client.company_name}</MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                        <FormError error={errors?.client} />
                                                    </Grid>
                                                    <Grid item xs={2} align='end'>
                                                        <IconButton aria-label="delete" size="25px" align='end'
                                                            onClick={() => setOpen(true)}>
                                                            <AddCircleRoundedIcon color='success' fontSize="inherit" />
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>

                                                <Grid item xs={12} md={6} p={1}>
                                                    <TextField type="text" size='small'
                                                        fullWidth
                                                        label="Наименование"
                                                        placeholder="Наименование"
                                                        defaultValue={req.name_of_cargo}
                                                        {...register('name_of_cargo', {
                                                            required: true,
                                                        })}
                                                    />
                                                    <FormError error={errors?.name_of_cargo} />
                                                </Grid>

                                                <Grid item xs={12} md={6} p={1}>
                                                    <TextField type="text" size='small'
                                                        fullWidth
                                                        label="Тип транспорта"
                                                        placeholder="Тип транспорта"
                                                        defaultValue={req.type_of_transport}
                                                        {...register('type_of_transport', {
                                                            required: true,
                                                        })}
                                                    />
                                                    <FormError error={errors?.type_of_transport} />
                                                </Grid>

                                                <Grid item xs={12} md={6} p={1}>
                                                    <TextField type="number" size='small'
                                                        fullWidth
                                                        label="Цена заказчика"
                                                        placeholder="Цена заказчика"
                                                        defaultValue={req.customer_price}
                                                        {...register('customer_price', {
                                                            required: true,
                                                            valueAsNumber: true
                                                        })}
                                                    />
                                                    <FormError error={errors?.customer_price} />
                                                </Grid>

                                                <Grid item xs={12} p={1}>
                                                    <FormControl sx={{ width: '100%' }} size="small">
                                                        <InputLabel id="demo-simple-select-label">Валюта</InputLabel>
                                                        <Select
                                                            className="select_field_edit_page"
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            label="Валюта"
                                                            defaultValue={req.currency}
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

                                            <Grid container item xs={12} mt={2} component={Paper}>
                                                <Grid item xs={12} pl={2} pt={1}>
                                                    <Typography variant='body1'>Информация о грузе</Typography>
                                                </Grid>
                                                <Grid item xs={12} md={6} p={1}>
                                                    <TextField type="text" size='small'
                                                        fullWidth
                                                        label="Вес"
                                                        placeholder="Вес"
                                                        defaultValue={req.weight}
                                                        {...register('weight', {
                                                            required: true,
                                                        })}
                                                    />
                                                    <FormError error={errors?.weight} />
                                                </Grid>

                                                <Grid item xs={12} md={6} p={1}>
                                                    <TextField type="text" size='small'
                                                        fullWidth
                                                        label="Палеты"
                                                        placeholder="Палеты"
                                                        defaultValue={req.pallets}
                                                        {...register('pallets')}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} md={6} p={1}>
                                                    <TextField type="text" size='small'
                                                        fullWidth
                                                        label="Длина"
                                                        placeholder="Длина"
                                                        defaultValue={req.yardage}
                                                        {...register('yardage')}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} md={6} p={1}>
                                                    <TextField type="text" size='small'
                                                        fullWidth
                                                        label="Ширина"
                                                        placeholder="Ширина"
                                                        defaultValue={req.width}
                                                        {...register('width')}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} md={6} p={1}>
                                                    <TextField type="text" size='small'
                                                        fullWidth
                                                        label="Высота"
                                                        placeholder="Высота"
                                                        defaultValue={req.height}
                                                        {...register('height')}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} md={6} p={1}>
                                                    <TextField type="text" size='small'
                                                        fullWidth
                                                        label="Объем"
                                                        placeholder="Объем"
                                                        defaultValue={req.volume}
                                                        {...register('volume')}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} p={1}>
                                                    <TextField type="text" size='small' multiline minRows='5'
                                                        fullWidth
                                                        label="Дополнительная информация"
                                                        placeholder="Дополнительная информация"
                                                        defaultValue={req.note}
                                                        {...register('note',)}
                                                    />
                                                    <FormError error={errors?.note} />
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid container item xs={12} md={5.5} m={1} component={Paper} alignContent='baseline'>
                                            <Grid item xs={12} pl={2} pt={1}>
                                                <Typography variant='body1'>Информация о доставке</Typography>
                                            </Grid>
                                            <Grid item xs={12} md={6} p={1}>
                                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                                                    <Controller
                                                        name="date_of_shipment"
                                                        control={control}
                                                        rules={{
                                                            required: true,
                                                        }}
                                                        defaultValue={new Date(req.date_of_shipment)}
                                                        render={({ field }) => (
                                                            <DatePicker
                                                                format="yyyy-MM-dd"
                                                                className='date_picker'
                                                                label="Дата загрузки"
                                                                value={field.value}
                                                                onChange={(value) => field.onChange(value)}
                                                            />
                                                        )} />
                                                </LocalizationProvider>
                                                <FormError error={errors?.date_of_shipment} />
                                            </Grid>

                                            <Grid item xs={12} md={6} p={1}>
                                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                                                    <Controller
                                                        name="date_of_delivery"
                                                        control={control}
                                                        rules={{
                                                            required: true,
                                                        }}
                                                        defaultValue={new Date(req.date_of_delivery)}
                                                        render={({ field }) => (
                                                            <DatePicker
                                                                format="yyyy-MM-dd"
                                                                className='date_picker'
                                                                label="Дата доставки"
                                                                value={field.value}
                                                                onChange={(value) => field.onChange(value)}
                                                            />
                                                        )} />
                                                </LocalizationProvider>
                                                <FormError error={errors?.date_of_delivery} />
                                            </Grid>

                                            {countries &&
                                                <React.Fragment>
                                                    <Grid item xs={12} md={6} p={1}>
                                                        <Autocomplete
                                                            onInput={(e) => setValueCountry(e.target.value)}
                                                            disablePortal
                                                            id="combo-box-demo"
                                                            fullWidth
                                                            size='small'
                                                            defaultValue={req.country_of_dispatch}
                                                            options={countries}
                                                            getOptionLabel={(option) => option}
                                                            renderInput={(params) => <TextField {...register('country_of_dispatch', { required: true })} {...params} label="Страна отгрузки" />}
                                                        />
                                                        <FormError error={errors?.country_of_dispatch} />
                                                    </Grid>

                                                    <Grid item xs={12} md={6} p={1}>
                                                        <Autocomplete
                                                            onInput={(e) => setValueCountry(e.target.value)}
                                                            disablePortal
                                                            id="combo-box-demo"
                                                            fullWidth
                                                            size='small'
                                                            defaultValue={req.delivery_country}
                                                            options={countries}
                                                            getOptionLabel={(option) => option}
                                                            renderInput={(params) => <TextField {...register('delivery_country', { required: true })} {...params} label="Страна доставки" />}
                                                        />
                                                        <FormError error={errors?.delivery_country} />
                                                    </Grid>
                                                </React.Fragment>
                                            }

                                            {cities &&
                                                <React.Fragment>
                                                    <Grid item xs={12} md={6} p={1}>
                                                        <Autocomplete
                                                            onInput={(e) => setValueCity(e.target.value)}
                                                            disablePortal
                                                            id="combo-box-demo"
                                                            fullWidth
                                                            size='small'
                                                            defaultValue={req.city_of_dispatch}
                                                            options={cities}
                                                            getOptionLabel={(option) => option}
                                                            renderInput={(params) => <TextField {...register('city_of_dispatch', { required: true })} {...params} label="Город отгрузки" />}
                                                        />

                                                        <FormError error={errors?.city_of_dispatch} />
                                                    </Grid>

                                                    <Grid item xs={12} md={6} p={1}>
                                                        <Autocomplete
                                                            onInput={(e) => setValueCity(e.target.value)}
                                                            disablePortal
                                                            id="combo-box-demo"
                                                            fullWidth
                                                            size='small'
                                                            defaultValue={req.delivery_city}
                                                            options={cities}
                                                            getOptionLabel={(option) => option}
                                                            renderInput={(params) => <TextField {...register('delivery_city', { required: true })} {...params} label="Город доставки" />}
                                                        />

                                                        <FormError error={errors?.delivery_city} />
                                                    </Grid>
                                                </React.Fragment>
                                            }

                                            <Grid item xs={12} md={6} p={1}>
                                                <TextField type="text" size='small'
                                                    fullWidth
                                                    label="Адрес отгрузки"
                                                    placeholder="Адрес отгрузки"
                                                    defaultValue={req.address_of_dispatch}
                                                    {...register('address_of_dispatch')}
                                                />
                                            </Grid>

                                            <Grid item xs={12} md={6} p={1}>
                                                <TextField type="text" size='small'
                                                    fullWidth
                                                    label="Адрес доставки"
                                                    placeholder="Адрес доставки"
                                                    defaultValue={req.delivery_address}
                                                    {...register('delivery_address')}
                                                />
                                            </Grid>


                                            {carriers &&
                                                <Grid item xs={12} mb={1} mt={1} p={1}>
                                                    <FormControl sx={{ width: '100%' }} size="small">
                                                        <InputLabel id="demo-simple-select-label">Перевозчики</InputLabel>
                                                        <Select
                                                            className="select_field_edit_page"
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            label="Перевозчики"
                                                            defaultValue={req.carrier}
                                                            {...register('carrier', { required: true })}
                                                        >
                                                            {carriers?.map((carrier) => (
                                                                <MenuItem value={carrier.id}>{carrier.contact_person}, {carrier.contact_info}</MenuItem>
                                                            ))}

                                                        </Select>
                                                    </FormControl>
                                                    <FormError error={errors?.carrier} />
                                                </Grid>
                                            }
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            }

                            <CardActions align='center' className='card_action'>
                                <Grid container p={1} justifyContent='flex-end'>

                                    <Grid item xs={6} md={2} align='start' p={1}>
                                        <Button variant='outlined' color='success' type='submit'>Обновить запрос</Button>
                                    </Grid>
                                </Grid>
                            </CardActions>
                        </form>
                        <CreateClient setOpen={setOpen} open={open} setClients={setClients} />
                    </Card>
                    <ErrorMessage alertInfo={alertInfo} setAlertInfo={setAlertInfo} />
                </DialogContent>

            </BootstrapDialog>
        </Grid>
    )
}