import React, { useEffect, useState } from 'react';
import { Grid, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, Pagination } from '@mui/material';
import { api } from '../../../api/api';
import FinesFilter from '../filters/FinesFilter';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import InfoRequestDialog from './dialogs/InfoRequestDialog';

const initial_data = {
    company_name: '', unp: '', executor: 0
}

export default function Fines() {
    const [data, setData] = useState(null)

    const [filterData, setFilterData] = useState(initial_data)
    const [sendFilter, setSendFilter] = useState(false)
    const [filterOpen, setFilterOpen] = useState(false)

    const [selector, setSelector] = useState('client')

    const [openDialog, setOpenDialog] = useState(false)
    const [dialogTitle, setDialogTitle] = useState('')
    const [dialogData, setDialogData] = useState([])

    const [page, setPage] = React.useState(1)
    const [countPage, setCountPage] = React.useState(0)

    const get_dialog_data = (id, currency) => {
        api(`/api/requests/on_it/`, 'GET', {}, false, {
            params: {
                ...selector === 'client' ? { client_id: id } : { executor: id },
                currency: currency,
                payment_from_client: false
            }
        }).then(res => {
            setDialogData(res.data.results)
        })
    }

    const get_fines = async (page_size=null) => {
        await api('/api/requests/get_fines/', 'GET', {}, false, {
            params: {
                ...filterData,
                switcher: selector,
                page: page_size ? page_size : 1
            }
        }).then((res) => {
            setPage(page_size ? page_size : 1)
            setCountPage(res.data.total_pages)
            setData(res.data.results)
        })
    }

    useEffect(() => {
        get_fines()
    }, [])

    useEffect(() => {
        if (data) {
            get_fines()
        }
    }, [sendFilter, selector])

    const handleChangePage = (e, v) => {
        setPage(v)
        get_fines(v)
    }

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
                                {selector === 'executor' && <TableCell align="left">Менеджер</TableCell>}
                                <TableCell align="left">Оплата перевозчику</TableCell>
                                <TableCell align="left">Сумма неоплаченных заказов</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data?.map((el, ind) => (
                                <TableRow
                                    key={ind}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    {selector === 'client' && <TableCell align="left" component="th" scope="row">{el?.client?.company_name}</TableCell>}
                                    {selector === 'client' && <TableCell align="left">{el?.client?.unp}</TableCell>}
                                    {selector === 'client' && <TableCell align="left">{el?.client?.contact_person}</TableCell>}
                                    {selector === 'executor' && <TableCell align="left">{el?.executor?.first_name} {el?.executor?.last_name}</TableCell>}

                                    <TableCell align="left">
                                        {el?.carrier_eur && `${el.carrier_eur} EUR; `}
                                        {el?.carrier_usd && `${el.carrier_usd} USD; `}
                                        {el?.carrier_rub && `${el.carrier_rub} RUB; `}
                                        {el?.carrier_byn && `${el.carrier_byn} BYN; `}
                                    </TableCell>
                                    <TableCell align="left">
                                        {['sum_eur', 'sum_usd', 'sum_rub', 'sum_byn'].map(key => (
                                            el?.[key] &&
                                            <Button key={key} onClick={() => {
                                                setDialogTitle(`${el?.[key]} ${key.split('_')[1].toUpperCase()}`)
                                                get_dialog_data(el?.client ? el.client.id : el.executor.id, key.split('_')[1].toUpperCase())
                                                setOpenDialog(true)
                                            }}>
                                                {`${el?.[key]} ${key.split('_')[1].toUpperCase()}`}
                                            </Button>
                                        ))}
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

            {openDialog && <InfoRequestDialog open={openDialog} setOpen={setOpenDialog} title={`Просмотр заявок входящие в сумму ${dialogTitle}`} dialogData={dialogData} />}
        </Grid>
    )
}