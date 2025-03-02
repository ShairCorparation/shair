import { Grid, FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material"
import { useEffect, useState } from "react"
import { api } from "../../../api/api"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ruRU } from '@mui/x-date-pickers/locales';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


export default function ExecutorFilter({ filterData, setFilterData }) {
    const [executorList, setExecutorList] = useState([])

    const get_users_info = async () => {
        await api('/auth/users_info/').then((res) => {
            setExecutorList(res.data)
        })
    }

    useEffect(() => {
        get_users_info()
    }, [])

    return (
        <Grid container item p={0} justifyContent={'center'} alignItems={'center'} gap={'10px'}>
            <Grid item>
                <FormControl sx={{ width: '250px' }} size="small">
                    <InputLabel id="demo-simple-select-label">Исполнитель</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={filterData?.executor ? filterData?.executor : 0}
                        label="Исполнитель"
                        onChange={(e) => setFilterData({...filterData, executor: e.target.value})}
                    >
                        <MenuItem value={0}>Выбрать исполнителя</MenuItem>
                        {executorList.map(el => <MenuItem key={el.id} value={el.id}>{el.first_name} {el.last_name}</MenuItem>)}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item alignItems='center' className='input_date_container' justifyContent='center' p={1} ml={1}>
                <span>Дата загрузки: </span>
                <LocalizationProvider dateAdapter={AdapterDayjs}
                    localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}>
                    <DatePicker
                        value={filterData?.date_of_shipment ? filterData?.date_of_shipment : null}
                        className='date_picker'
                        onChange={(value) => setFilterData({ ...filterData, date_of_shipment: value.format('YYYY-MM-DD') })}
                    />
                </LocalizationProvider>
                <span>Дата доставки: </span>
                <LocalizationProvider dateAdapter={AdapterDayjs}
                    localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}>
                    <DatePicker
                        value={filterData?.date_of_delivery ? filterData?.date_of_delivery : null}
                        className='date_picker'
                        onChange={(value) => setFilterData({ ...filterData, date_of_delivery: value.format('YYYY-MM-DD') })}
                    />
                </LocalizationProvider>
            </Grid>
            <Grid item>
                <Button variant="outlined" onClick={() => setFilterData({})}>Сбросить фильтр</Button>
            </Grid>
        </Grid>
    )
}