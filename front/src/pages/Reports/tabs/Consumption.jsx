import React, { useEffect, useState } from 'react';
import { Grid, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, Pagination } from '@mui/material';
import { api } from '../../../api/api';
import ConsumptionFilter from '../filters/ConsumptionFilter';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

export default function Consumption() {
    const initial_data = {
        request_id: '', unp: '', name_of_cargo: '',
        date_of_shipment: '', date_of_delivery: ''
    }

    const [filterData, setFilterData] = useState(initial_data)
    const [sendFilter, setSendFilter] = useState(false)
    const [filterOpen, setFilterOpen] = useState(false)

    const [data, setData] = useState(null)

    const [page, setPage] = useState(1)
    const [countPage, setCountPage] = useState(0)

    const get_consumption = async (page_size = null) => {
        await api('/api/requests/get_consumption/', 'GET', {}, false, {
            params: {
                ...filterData,
                page: page_size ? page_size : 1
            }
        }).then((res) => {
            setPage(page_size ? page_size : 1)
            setCountPage(res.data.total_pages)
            setData(res.data.results)
        })
    }

    useEffect(() => {
        get_consumption()

    }, [])

    useEffect(() => {
        data &&
            get_consumption()
    }, [sendFilter])

    const handleChangePage = (e, v) => {
        setPage(v)
        get_consumption(v)
    }

    return (
        <Grid container item justifyContent='center' >
            <Grid item component={Paper} xs={12} md={8}>
                <Button onClick={() => setFilterOpen(!filterOpen)} color='secondary'><FilterAltIcon />
                    {filterOpen ? 'Скрыть фильтры' : 'Показать фильтры'}
                </Button>
                {filterOpen &&
                    <ConsumptionFilter setFilterData={setFilterData} filterData={filterData} setSendFilter={setSendFilter} sendFilter={sendFilter} initial_data={initial_data} />
                }
            </Grid>
            <Grid item xs={12} md={8} m={1}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Перевозчик</TableCell>
                                <TableCell align="left">Ставка</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data?.map((el) => (
                                <TableRow
                                    key={el?.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="left" component="th" scope="row">{el?.carrier?.company_name}</TableCell>
                                    <TableCell align="left">
                                        {el?.sum_eur && `${el.sum_eur} EUR; `}
                                        {el?.sum_usd && `${el.sum_usd} USD; `}
                                        {el?.sum_rub && `${el.sum_rub} RUB; `}
                                        {el?.sum_byn && `${el.sum_byn} BYN; `}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Grid container p={1} justifyContent={'flex-end'}>
                    <Pagination shape="rounded" variant='outlined' color='secondary' page={page} count={countPage} onChange={handleChangePage} />
                </Grid>
            </Grid>
        </Grid>
    )
}