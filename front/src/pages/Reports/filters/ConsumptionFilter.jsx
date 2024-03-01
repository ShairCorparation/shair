import * as React from 'react'
import { Grid, IconButton, TextField, Button } from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ruRU } from '@mui/x-date-pickers/locales';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import '../../Clients/filters/filter.css'

export default function ConsumptionFilter({ setFilterData, filterData, setSendFilter, sendFilter, initial_data }) {
    return (
        <Grid container item xs={12} p={1}>
            <Grid container item xs={12} spacing={1} p={1}>
                <Grid item xs={2} md={1.6} lg={1.6} xl={1.5}>
                    <IconButton aria-label="delete" 
                        onClick={()=> {
                            setFilterData({...filterData, request_id: '', name_of_cargo: ''})
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

                <Grid item alignItems='center' className='input_container' justifyContent='center' p={1} ml={1}>
                    <span>Наименование: </span>
                    <TextField id="outlined-basic" variant="outlined" size='small'
                        value={filterData.name_of_cargo}
                        onChange={(e) => setFilterData({ ...filterData, name_of_cargo: e.target.value })}
                    />
                </Grid>
                
            </Grid>


            <Grid container item xs={12} spacing={1} p={1}>
                <Grid item xs={2} md={1.6} lg={1.6} xl={1.5}>
                    <IconButton aria-label="delete"
                        onClick={()=> {
                            setFilterData({...filterData, request_date_from: '', request_date_up: ''})
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