import * as React from 'react'
import { Grid, IconButton, TextField, Button } from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ruRU } from '@mui/x-date-pickers/locales';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import './filter.css'

export default function Filter({ setFilterData, filterData, setSendFilter, sendFilter, initial_data }) {
    return (
        <Grid container item xs={12} p={1}>
            <Grid container item xs={12} spacing={1} p={1}>
                <Grid item xs={2} md={1.2} lg={1.4} xl={1.1}>
                    <IconButton aria-label="delete" 
                        onClick={()=> {
                            setFilterData({...filterData, company_name: '', unp: '', created_date_from: '', created_date_up: ''})
                            setSendFilter(!sendFilter)
                            }}
                    >
                        <CancelIcon />
                    </IconButton>
                    Компания:
                </Grid>

                <Grid item alignItems='center' className='input_container' justifyContent='center' p={1} ml={1}>
                    <span>Название компании: </span>
                    <TextField id="outlined-basic" variant="outlined" size='small'
                        value={filterData.company_name}
                        onChange={(e) => setFilterData({ ...filterData, company_name: e.target.value })}
                    />
                </Grid>

                <Grid item alignItems='center' className='input_container' justifyContent='center' p={1} ml={1}>
                    <span>УНП: </span>
                    <TextField id="outlined-basic" variant="outlined" size='small'
                        value={filterData.unp}
                        onChange={(e) => setFilterData({ ...filterData, unp: e.target.value })}
                    />
                </Grid>
                <Grid item alignItems='center' className='input_date_container' justifyContent='center' p={1} ml={1}>
                    <span>Дата создания От: </span>
                    <LocalizationProvider dateAdapter={AdapterDayjs}
                        localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}>
                        <DatePicker
                            value={filterData.created_date_from !== '' ? filterData.created_date_from : null}
                            className='date_picker'
                            onChange={(value) => setFilterData({ ...filterData, created_date_from: value.format('YYYY-MM-DD') })}
                        />
                    </LocalizationProvider>
                    <span>До: </span>
                    <LocalizationProvider dateAdapter={AdapterDayjs}
                        localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}>
                        <DatePicker
                            value={filterData.created_date_up !== '' ? filterData.created_date_up : null}
                            className='date_picker'
                            onChange={(value) => setFilterData({ ...filterData, created_date_up: value.format('YYYY-MM-DD') })}
                        />
                    </LocalizationProvider>
                </Grid>
            </Grid>

            <Grid container item xs={12} spacing={1} p={1}>
                <Grid item xs={2} md={1.2} lg={1.4} xl={1.1}>
                    <IconButton aria-label="delete"
                        onClick={()=> {
                            setFilterData({...filterData, duration_country_from: '', duration_country_up: '', duration_city_from: '', duration_city_up: ''})
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
                    <span>В: </span>
                    <TextField label='Страна' id="outlined-basic" variant="outlined" size='small'
                        value={filterData.duration_country_up}
                        onChange={(e) => setFilterData({ ...filterData, duration_country_up: e.target.value })}
                    />
                </Grid>

                <Grid item alignItems='center' className='input_container' justifyContent='center' p={1} ml={1}>
                    <span>Направление Из: </span>
                    <TextField label='Город' id="outlined-basic" variant="outlined" size='small'
                        value={filterData.duration_city_from}
                        onChange={(e) => setFilterData({ ...filterData, duration_city_from: e.target.value })}
                    />
                    <span>В: </span>
                    <TextField label='Город' id="outlined-basic" variant="outlined" size='small'
                        value={filterData.duration_city_up}
                        onChange={(e) => setFilterData({ ...filterData, duration_city_up: e.target.value })}
                    />
                </Grid>
            </Grid>

            <Grid container item xs={12} spacing={1} p={1}>
                <Grid item xs={2} md={1.2} lg={1.4} xl={1.1}>
                    <IconButton aria-label="delete"
                        onClick={()=> {
                            setFilterData({...filterData, request_date_from: '', request_date_up: '', delivery_date_from: '', delivery_date_up: ''})
                            setSendFilter(!sendFilter)
                            }}
                    >
                        <CancelIcon />
                    </IconButton>
                    Даты:
                </Grid>

                <Grid item alignItems='center' className='input_date_container' justifyContent='center' p={1} ml={1}>
                    <span>Дата запроса От: </span>
                    <LocalizationProvider dateAdapter={AdapterDayjs}
                        localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}>
                        <DatePicker
                            value={filterData.request_date_from !== '' ? filterData.request_date_from : null}
                            className='date_picker'
                            onChange={(value) => setFilterData({ ...filterData, request_date_from: value.format('YYYY-MM-DD') })}
                        />
                    </LocalizationProvider>
                    <span>До: </span>
                    <LocalizationProvider dateAdapter={AdapterDayjs}
                        localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}>
                        <DatePicker
                            value={filterData.request_date_up !== '' ? filterData.request_date_up : null}
                            className='date_picker'
                            onChange={(value) => setFilterData({ ...filterData, request_date_up: value.format('YYYY-MM-DD') })}
                        />
                    </LocalizationProvider>
                </Grid>

                <Grid item alignItems='center' className='input_date_container' justifyContent='center' p={1} ml={1}>
                    <span>Дата доставки От: </span>
                    <LocalizationProvider dateAdapter={AdapterDayjs}
                        localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}>
                        <DatePicker
                            value={filterData.delivery_date_from !== '' ? filterData.delivery_date_from : null}
                            className='date_picker'
                            onChange={(value) => setFilterData({ ...filterData, delivery_date_from: value.format('YYYY-MM-DD') })}
                        />
                    </LocalizationProvider>
                    <span>До: </span>
                    <LocalizationProvider dateAdapter={AdapterDayjs}
                        localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}>
                        <DatePicker
                            value={filterData.delivery_date_up !== '' ? filterData.delivery_date_up : null}
                            className='date_picker'
                            onChange={(value) => setFilterData({ ...filterData, delivery_date_up: value.format('YYYY-MM-DD') })}
                        />
                    </LocalizationProvider>
                </Grid>
            </Grid>

            <Grid container item xs={12} spacing={1} p={1} justifyContent='flex-end'>
                <Grid item>
                    <Button color='error' onClick={()=> {
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
        </Grid>
    )
}