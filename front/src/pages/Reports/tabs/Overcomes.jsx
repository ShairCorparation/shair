import { Grid, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button } from "@mui/material"
import { useState, useEffect } from 'react'
import { api } from "../../../api/api"
import OvercomesFilter from "../filters/OvercomesFilter"
import FilterAltIcon from '@mui/icons-material/FilterAlt';

export default function Overcomes() {

    const initial_data = {
        request_id: '', company_name: '',
        duration_country_from: '', duration_city_from: '', duration_country_up: '', duration_city_up: '',
        date_of_shipment: '', date_of_delivery: '', executor: 0
    }

    const [filterData, setFilterData] = useState(initial_data)
    const [sendFilter, setSendFilter] = useState(false)
    const [filterOpen, setFilterOpen] = useState(false)

    const [selector, setSelector] = useState('client')

    const [content, setContent] = useState(null)


    useEffect(() => {
        let url;
        selector === 'client' ? url = `/api/clients/overcomes/` : selector === 'manager' && (url = `/auth/users_info/overcomes/`)
        api(url).then((res) => {
            setContent(res.data)
        })

    }, [selector])

    useEffect(() => {
        let url;
        selector === 'client' ? url = `/api/clients/overcomes/` : selector === 'manager' && (url = `/auth/users_info/overcomes/`)

        api(url, 'GET', {}, false,
            {
                params: {
                    request_id: filterData.request_id,
                    company_name: filterData.company_name,
                    duration_country_from: filterData.duration_country_from,
                    duration_city_from: filterData.duration_city_from,
                    duration_country_up: filterData.duration_country_up,
                    duration_city_up: filterData.duration_city_up,
                    date_of_shipment: filterData.date_of_shipment,
                    date_of_delivery: filterData.date_of_delivery,
                }
            }
        ).then((res) => {
            setContent(res.data)

        })


    }, [sendFilter])

    return (
        <Grid container item justifyContent='center' >
            <Grid item component={Paper} xs={12} md={10}>
                <Button onClick={() => setFilterOpen(!filterOpen)} color='secondary'><FilterAltIcon />
                    {filterOpen ? 'Скрыть фильтры' : 'Показать фильтры'}
                </Button>
                {filterOpen &&
                    <OvercomesFilter setFilterData={setFilterData} filterData={filterData} setSendFilter={setSendFilter} sendFilter={sendFilter} initial_data={initial_data} setSelector={setSelector} selector={selector} />
                }
            </Grid>
            <Grid item xs={12} md={10} m={1}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>

                                {selector === 'client' && <TableCell align="left">Клиент</TableCell>}
                                {selector === 'manager' && <TableCell align="left">Менеджер</TableCell>}
                                <TableCell align="left">Кол-во заказов</TableCell>
                                <TableCell align="left">Фрахт</TableCell>
                                <TableCell align="left">Расходы</TableCell>
                                <TableCell align="left">Прибыль</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {content?.map((el) => (
                                <TableRow key={el?.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                    <TableCell align="left" component="th" scope="row">
                                        {selector === 'client' ? el?.company_name : `${el.first_name} ${el.last_name}` }
                                    </TableCell>

                                    <TableCell align="left">{el?.count_request}</TableCell>

                                    <TableCell align="left">{el?.fraht} BYN</TableCell>
                                    <TableCell align="left">{el?.consumption} BYN</TableCell>
                                    <TableCell align="left">{Number(el?.fraht - el?.consumption).toFixed(2)} BYN</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    )
}