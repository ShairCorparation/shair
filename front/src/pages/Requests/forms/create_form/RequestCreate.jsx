import {
    Grid, Card, CardContent, CardActions, CardHeader, Button, FormControl, InputLabel, Select,
    MenuItem, TextField, Paper, Typography, IconButton, Autocomplete
} from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { ru } from 'date-fns/locale/ru';
import { ruRU } from '@mui/x-date-pickers/locales';
import { useForm, Controller } from 'react-hook-form'
import CreateClient from '../create_client/CreateClient';
import { useState, useEffect } from 'react'
import { api } from '../../../../api/api';
import FormError from '../../../../components/FormError/FormError';
import './request_create.css'


export default function RequestCreate() {
    const { register, control, reset, handleSubmit, formState: { errors } } = useForm({ mode: 'onSubmit' })
    const [clients, setClients] = useState(null)
    const [open, setOpen] = useState(false);
    const [countries, setCountries] = useState()

    const handleSave = (form_data) => {

        api(`/api/requests/`, 'POST', form_data)
            .then((res) => {
                window.location.href = '/'
            })
            .catch((err) => {
            })
    }

    useEffect(() => {
        api('/api/clients/', 'GET').then((res) => {
            setClients(res.data)
        })

        api('/api/countries/').then((res) => {
            setCountries([...res.data])
        })

    }, [])


    return (
        <Grid container p={0} justifyContent='center' alignItems='baseline' >
            <Card sx={{ width: '90%', marginTop: '50px' }} elevation={10}>
                <form onSubmit={handleSubmit(handleSave)} className='form_create'>
                    <CardHeader title='Создание нового запроса' align='center' sx={{ marginTop: '20px' }} />

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
                                                    {...register('client', { required: true })}
                                                >
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
                                            {...register('pallets')}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6} p={1}>
                                        <TextField type="text" size='small'
                                            fullWidth
                                            label="Длина"
                                            placeholder="Длина"
                                            {...register('yardage')}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6} p={1}>
                                        <TextField type="text" size='small'
                                            fullWidth
                                            label="Ширина"
                                            placeholder="Ширина"
                                            {...register('width')}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6} p={1}>
                                        <TextField type="text" size='small'
                                            fullWidth
                                            label="Высота"
                                            placeholder="Высота"
                                            {...register('height')}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6} p={1}>
                                        <TextField type="text" size='small'
                                            fullWidth
                                            label="Объем"
                                            placeholder="Объем"
                                            {...register('volume')}
                                        />
                                    </Grid>

                                    <Grid item xs={12} p={1}>
                                        <TextField type="text" size='small' multiline minRows='5'
                                            fullWidth
                                            label="Дополнительная информация"
                                            placeholder="Дополнительная информация"
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
                                            defaultValue={null}
                                            render={({ field }) => (
                                                <DatePicker
                                                    localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}
                                                    className='date_picker'
                                                    format="yyyy-MM-dd"
                                                    label="Дата загрузки"
                                                    value={field.value}
                                                    onChange={(value) => field.onChange(`${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}`)}
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
                                            defaultValue={null}
                                            render={({ field }) => (
                                                <DatePicker
                                                    localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}
                                                    format="yyyy-MM-dd"
                                                    className='date_picker'
                                                    label="Дата доставки"
                                                    value={field.value}
                                                    onChange={(value) => field.onChange(`${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}`)}
                                                />
                                            )} />
                                    </LocalizationProvider>
                                    <FormError error={errors?.date_of_delivery} />
                                </Grid>

                                <Grid item xs={12} md={6} p={1}>

                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        {...register('country_of_dispatch', { required: true })}
                                        fullWidth
                                        size='small'
                                        getOptionLabel={(option) => option.name}
                                        options={countries}

                                        renderInput={(params) => <TextField {...register('country_of_dispatch', { required: true })} {...params} label="Страна отгрузки" />}
                                    />

                                    <FormError error={errors?.country_of_dispatch} />
                                </Grid>

                                <Grid item xs={12} md={6} p={1}>
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        {...register('delivery_country', { required: true })}
                                        fullWidth
                                        size='small'
                                        getOptionLabel={(option) => option.name}
                                        options={countries}

                                        renderInput={(params) => <TextField {...register('delivery_country', { required: true })} {...params} label="Страна доставки" />}
                                    />

                                    <FormError error={errors?.delivery_country} />
                                </Grid>

                                <Grid item xs={12} md={6} p={1}>
                                    <TextField type="text" size='small'
                                        fullWidth
                                        label="Город отгрузки"
                                        placeholder="Город отгрузки"
                                        {...register('city_of_dispatch', { required: true })}
                                    />
                                    <FormError error={errors?.city_of_dispatch} />
                                </Grid>

                                <Grid item xs={12} md={6} p={1}>
                                    <TextField type="text" size='small'
                                        fullWidth
                                        label="Город доставки"
                                        placeholder="Город доставки"
                                        {...register('delivery_city', { required: true })}
                                    />
                                    <FormError error={errors?.delivery_city} />
                                </Grid>


                                <Grid item xs={12} md={6} p={1}>
                                    <TextField type="text" size='small'
                                        fullWidth
                                        label="Адрес отгрузки"
                                        placeholder="Адрес отгрузки"
                                        {...register('address_of_dispatch')}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6} p={1}>
                                    <TextField type="text" size='small'
                                        fullWidth
                                        label="Адрес доставки"
                                        placeholder="Адрес доставки"
                                        {...register('delivery_address')}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>

                    <CardActions align='center' className='card_action'>
                        <Grid container p={1} justifyContent='flex-end'>
                            <Grid item xs={6} md={2} align='end' p={1}>
                                <Button variant='outlined' onClick={() => reset()} color='error'>Очистить</Button>
                            </Grid>

                            <Grid item xs={6} md={2} align='start' p={1}>
                                <Button variant='outlined' color='success' type='submit'>Создать</Button>
                            </Grid>
                        </Grid>
                    </CardActions>
                </form>
                <CreateClient setOpen={setOpen} open={open} setClients={setClients} />
            </Card>
        </Grid>
    )
}