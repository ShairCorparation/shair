import * as React from 'react'
import { Grid, IconButton, TextField, Button, FormControl, Select, MenuItem } from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ruRU } from '@mui/x-date-pickers/locales';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import '../../Clients/filters/filter.css'
import { api } from '../../../api/api';

export default function FinesFilter({ setFilterData, filterData, setSendFilter, sendFilter, initial_data, selector, setSelector }) {

    const [users, setUsers] = React.useState()

    React.useEffect(() => {
        api('/auth/users_info/').then((res) => {
            setUsers(res.data)
        })

    }, [])

    return (
        <Grid container item xs={12} p={1}>
            <Grid container item xs={12} spacing={1} p={1}>
                <Grid container item xs={12} spacing={1} p={1}>
                    <Grid item className='selector_container' xs={2} md={1.2} lg={1.6} xl={1.5}>
                        <span>Группировать: </span>
                    </Grid>

                    <Grid item>
                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                            <Select
                                id="demo-select-small"
                                value={selector}
                                onChange={(v) => {
                                    setSelector(v.target.value)
                                    setFilterData(initial_data)
                                }}
                            >
                                <MenuItem value={'client'}>по клиенту</MenuItem>
                                <MenuItem value={'executor'}>по менеджеру</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                {selector === 'client' &&
                    <Grid container p={0}>
                        <Grid item xs={2} md={1.2} lg={1.4} xl={1.1}>
                            <IconButton aria-label="delete"
                                onClick={() => {
                                    setFilterData({ ...filterData, company_name: '', unp_on: '' })
                                    setSendFilter(!sendFilter)
                                }}
                            >
                                <CancelIcon />
                            </IconButton>
                            ID:
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
                    </Grid>
                }

                {selector === 'executor' &&
                    <Grid item xs={12}>
                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                            <Select
                                id="demo-select-small"
                                value={filterData.executor}
                                onChange={(e) => setFilterData({ ...filterData, executor: e.target.value })}
                            >
                                <MenuItem value={0}>Выберете менеджера</MenuItem>
                                {users?.map((user) => (
                                    <MenuItem value={user.id}>{user.first_name} {user.last_name}</MenuItem>
                                ))}

                            </Select>
                        </FormControl>
                    </Grid>
                }

                <Grid container p={0} pt={1}>
                    <Grid item xs={2} md={1.2} lg={1.4} xl={1.1} alignContent={'center'}>
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
                                value={filterData?.date_of_shipment ? filterData.date_of_shipment : null}
                                className='date_picker'
                                onChange={(value) => setFilterData({ ...filterData, date_of_shipment: value.format('YYYY-MM-DD') })}
                            />
                        </LocalizationProvider>
                        <span>Дата доставки от: </span>
                        <LocalizationProvider dateAdapter={AdapterDayjs}
                            localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}>
                            <DatePicker
                                value={filterData?.date_of_delivery_from ? filterData.date_of_delivery_from : null}
                                className='date_picker'
                                onChange={(value) => setFilterData({ ...filterData, date_of_delivery_from: value.format('YYYY-MM-DD') })}
                            />
                        </LocalizationProvider>
                        <span>Дата доставки до: </span>
                        <LocalizationProvider dateAdapter={AdapterDayjs}
                            localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}>
                            <DatePicker
                                value={filterData?.date_of_delivery_to ? filterData.date_of_delivery_to : null}
                                className='date_picker'
                                onChange={(value) => setFilterData({ ...filterData, date_of_delivery_to: value.format('YYYY-MM-DD') })}
                            />
                        </LocalizationProvider>
                    </Grid>
                </Grid>
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
        </Grid>
    )
}