import * as React from 'react'
import { Grid, IconButton, TextField, Button, FormControl, Select, MenuItem, Checkbox, FormControlLabel } from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ruRU } from '@mui/x-date-pickers/locales';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import '../../Clients/filters/filter.css'
import { api } from '../../../api/api';

export default function OvercomesFilter({ setFilterData, filterData, setSendFilter, sendFilter, initial_data, setSelector, selector }) {

    const [users, setUser] = React.useState(null)

    React.useEffect(() => {
        api('/auth/users_info/').then((res) => {
            setUser(res.data)
        })
    }, [])

    return (
        <Grid container p={1}>
            <Grid container spacing={1} p={1}>
                <Grid item className='selector_container' xs={2} md={1.2} lg={1.6} xl={1.5}>
                    <span>Группировать: </span>
                </Grid>

                <Grid item>
                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <Select
                            id="demo-select-small"
                            value={selector}
                            onChange={(v) => setSelector(v.target.value)}
                        >
                            <MenuItem value={'executor'}>по менеджеру</MenuItem>
                            <MenuItem value={'client'}>по клиенту</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

            </Grid>
            <Grid container spacing={1} p={1}>
                <Grid item xs={2} md={1.2} lg={1.6} xl={1.5}>
                    <IconButton aria-label="delete"
                        onClick={() => {
                            setFilterData({ ...filterData, request_id: '', company_name: '', executor: '' })
                            setSendFilter(!sendFilter)
                        }}
                    >
                        <CancelIcon />
                    </IconButton>
                    ID:
                </Grid>

                <Grid item alignItems='center' className='input_container' justifyContent='center' p={1} ml={1}>
                    <span>Нр заказа: </span>
                    <TextField id="outlined-basic" variant="outlined" size='small'
                        value={filterData.request_id}
                        onChange={(e) => setFilterData({ ...filterData, request_id: e.target.value })}
                    />
                </Grid>

                {selector === 'client' &&
                    <Grid item alignItems='center' className='input_container' justifyContent='center' p={1} ml={1}>
                        <span>Компания: </span>
                        <TextField id="outlined-basic" variant="outlined" size='small'
                            value={filterData.company_name}
                            onChange={(e) => setFilterData({ ...filterData, company_name: e.target.value })}
                        />
                    </Grid>
                }

                {selector === 'executor' &&
                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <Select
                            id="demo-select-small"
                            value={filterData.executor}
                            onChange={(e) => setFilterData({ ...filterData, executor: e.target.value })}
                        >
                            <MenuItem value={0}>Выберете менеджера</MenuItem>
                            {users?.map((user) => (
                                <MenuItem value={user?.id}>{user?.first_name} {user?.last_name}</MenuItem>
                            ))}

                        </Select>
                    </FormControl>
                }

            </Grid>

            <Grid container spacing={1} p={1}>
                <Grid item xs={2} md={1.2} lg={1.6} xl={1.5}>
                    <IconButton aria-label="delete"
                        onClick={() => {
                            setFilterData({ ...filterData, duration_country_from: '', duration_city_from: '', duration_country_up: '', duration_city_up: '' })
                            setSendFilter(!sendFilter)
                        }}
                    >
                        <CancelIcon />
                    </IconButton>
                    Направления:
                </Grid>

                <Grid item alignItems='center' className='input_container' justifyContent='center' p={1} ml={1}>
                    <span>Направление Из: </span>
                    <TextField label='Страна' id="outlined-basic" variant="outlined" size='small'
                        value={filterData.duration_country_from}
                        onChange={(e) => setFilterData({ ...filterData, duration_country_from: e.target.value })}
                    />
                    <span> </span>
                    <TextField label='Город' id="outlined-basic" variant="outlined" size='small'
                        value={filterData.duration_city_from}
                        onChange={(e) => setFilterData({ ...filterData, duration_city_from: e.target.value })}
                    />
                </Grid>

                <Grid item alignItems='center' className='input_container' justifyContent='center' p={1} ml={1}>
                    <span>В: </span>
                    <TextField label='Страна' id="outlined-basic" variant="outlined" size='small'
                        value={filterData.duration_country_up}
                        onChange={(e) => setFilterData({ ...filterData, duration_country_up: e.target.value })}
                    />
                    <span> </span>
                    <TextField label='Город' id="outlined-basic" variant="outlined" size='small'
                        value={filterData.duration_city_up}
                        onChange={(e) => setFilterData({ ...filterData, duration_city_up: e.target.value })}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={1} p={1}>
                <Grid item xs={2} md={1.2} lg={1.6} xl={1.5}>
                    <IconButton aria-label="delete"
                        onClick={() => {
                            setFilterData({ ...filterData, date_of_shipment: '', date_of_delivery: '' })
                            setSendFilter(!sendFilter)
                        }}
                    >
                        <CancelIcon />
                    </IconButton>
                    Даты:
                </Grid>

                <Grid item alignItems='center' className='input_date_container' justifyContent='center' p={1} ml={1}>
                    <span>Дата загрузки: </span>
                    <LocalizationProvider dateAdapter={AdapterDayjs}
                        localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}>
                        <DatePicker
                            value={filterData.date_of_shipment !== '' ? filterData.date_of_shipment : null}
                            className='date_picker'
                            onChange={(value) => setFilterData({ ...filterData, date_of_shipment: value.format('YYYY-MM-DD') })}
                        />
                    </LocalizationProvider>
                    <span>Дата доставки: </span>
                    <LocalizationProvider dateAdapter={AdapterDayjs}
                        localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}>
                        <DatePicker
                            value={filterData.date_of_delivery !== '' ? filterData.date_of_delivery : null}
                            className='date_picker'
                            onChange={(value) => setFilterData({ ...filterData, date_of_delivery: value.format('YYYY-MM-DD') })}
                        />
                    </LocalizationProvider>
                </Grid>
            </Grid>

            <Grid container p={1}>
                <FormControlLabel control={
                    <Checkbox checked={filterData?.include_archive} onChange={(e) => setFilterData({ ...filterData, include_archive: e.target.checked})} />} 
                    label="учитывать архив" />
            </Grid>

            <Grid container item xs={12} spacing={1} p={1} justifyContent='flex-end'>
                <Grid item>
                    <Button color='error' onClick={() => {
                        setFilterData(initial_data)
                        setSendFilter(!sendFilter)
                    }}
                    >
                        Очистить фильтр
                    </Button>
                </Grid>

                <Grid item>
                    <Button color='success' onClick={() => setSendFilter(!sendFilter)}>Применить фильтры</Button>
                </Grid>
            </Grid>
        </Grid >
    )
}