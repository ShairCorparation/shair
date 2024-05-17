import React, { useEffect, useState } from 'react';
import { Grid, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import { api } from '../../../api/api';
import ConsumptionFilter from '../filters/ConsumptionFilter';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import axios from 'axios';


export default function Consumption() {
    const initial_data = {
        request_id: '', unp: '', name_of_cargo: '',
        date_of_shipment: '', date_of_delivery: ''
    }

    const [filterData, setFilterData] = useState(initial_data)
    const [sendFilter, setSendFilter] = useState(false)
    const [filterOpen, setFilterOpen] = useState(false)

    const [EUR, setEUR] = React.useState(0)
    const [USD, setUSD] = React.useState(0)
    const [RUB, setRUB] = React.useState(0)

    const [carriers, setCarriers] = useState(null)

    useEffect(() => {
        api('/api/request_carriers/consumption/', 'GET', {}, false, {
            params: {
                request_id: filterData.request_id,
                name_of_cargo: filterData.name_of_cargo,
                date_of_shipment: filterData.date_of_shipment,
                date_of_delivery: filterData.date_of_delivery
            }
        }).then((res) => {
            setCarriers(res.data)
        })
    }, [sendFilter])


    useEffect(() => {
        api('/api/request_carriers/consumption/').then((res) => {
            setCarriers(res.data)
        })

        const loadCurrency = async (name) => {
            await axios.get(`https://api.nbrb.by/exrates/rates/${name}UR?parammode=2`).then((res) => {

                name === 'EUR' && setEUR(res.data.Cur_OfficialRate)
                name === 'USD' && setUSD(res.data.Cur_OfficialRate)
                name === 'RUB' && setRUB(res.data.Cur_OfficialRate)

            })
        }

        loadCurrency('EUR')
        loadCurrency('USD')
        loadCurrency('RUB')
    }, [])

    const convertCurrency = (amount, currency) => {
        let res
        currency === 'USD' && (res = amount * USD)
        currency === 'EUR' && (res = amount * EUR)
        currency === 'RUB' && (res = amount * RUB / 100)
        currency === 'BYN' && (res = amount)
        return res.toFixed(2);
    };

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
                            {carriers?.map((carrier) => (
                                <TableRow
                                    key={carrier?.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="left" component="th" scope="row">{carrier?.company_name}</TableCell>
                                    <TableCell align="left">{convertCurrency(carrier?.carrier_rate, carrier?.carrier_currency)} BYN</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>


        </Grid>
    )
}