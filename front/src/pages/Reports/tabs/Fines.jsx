import React, { useEffect, useState } from 'react';
import { Grid, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import { api } from '../../../api/api';
import FinesFilter from '../filters/FinesFilter';
import FilterAltIcon from '@mui/icons-material/FilterAlt';


export default function Fines() {
    const [clients, setClients] = useState(null)

    const initial_data = {
        company_name_on_it: '', unp_on_it: '', executor: 0
    }

    const [filterData, setFilterData] = useState(initial_data)
    const [sendFilter, setSendFilter] = useState(false)
    const [filterOpen, setFilterOpen] = useState(false)

    const [selector, setSelector] = useState('client')

    useEffect(() => {
        api('/api/clients/fines/').then((res) => {
            setClients(res.data)
        })

    }, [])

    useEffect(() => {
        if (selector === 'client') {
            api(`/api/clients/fines/`, 'GET', {}, false,
                {
                    params: {
                        company_name_on_it: filterData.company_name_on_it,
                        unp_on_it: filterData.unp_on_it,
                    }
                }
            ).then((res) => {
                setClients(res.data)
            })
        }

        if (selector === 'manager') {

            api(`/auth/users_info/fines/`, 'GET', {}, false,
                {
                    params: {
                        executor: filterData.executor
                    }
                }
            ).then((res) => {
                setClients(res.data)
                console.log(res.data)
            })
        }

    }, [sendFilter])


    return (
        <Grid container item justifyContent='center' >
            <Grid item component={Paper} xs={12} md={8}>
                <Button onClick={() => setFilterOpen(!filterOpen)} color='secondary'><FilterAltIcon />
                    {filterOpen ? 'Скрыть фильтры' : 'Показать фильтры'}
                </Button>
                {filterOpen &&
                    <FinesFilter setFilterData={setFilterData} filterData={filterData} setSendFilter={setSendFilter} sendFilter={sendFilter} initial_data={initial_data} setSelector={setSelector} selector={selector} />
                }
            </Grid>
            <Grid item xs={12} md={8} m={1}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                {selector === 'client' && <TableCell align="left">Название компании</TableCell>}
                                {selector === 'client' && <TableCell align="left">УНП</TableCell>}
                                {selector === 'client' && <TableCell align="left">Контакт</TableCell>}
                                {selector === 'manager' && <TableCell align="left">Менеджер</TableCell>}
                                <TableCell align="left">Оплата перевозчику</TableCell>
                                <TableCell align="left">Сумма неоплаченных заказов</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {clients?.map((client) => (
                                <TableRow
                                    key={client?.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    {selector === 'client' && <TableCell align="left" component="th" scope="row">{client?.company_name}</TableCell>}
                                    {selector === 'client' && <TableCell align="left">{client?.unp}</TableCell>}
                                    {selector === 'client' && <TableCell align="left">{client?.contact_person}</TableCell>}
                                    {selector === 'manager' && <TableCell align="left">{client?.first_name} {client?.last_name}</TableCell>}

                                    <TableCell align="left">{client?.sum_carrier_price} BYN</TableCell>
                                    <TableCell align="left">{client?.sum_fines} BYN</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    )
}