import { Grid, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, Pagination } from "@mui/material"
import { useState, useEffect } from 'react'
import { api } from "../../../api/api"
import OvercomesFilter from "../filters/OvercomesFilter"
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import InfoRequestDialog from "./dialogs/InfoRequestDialog";

export default function Overcomes() {

    const initial_data = {
        request_id: '', company_name: '',
        duration_country_from: '', duration_city_from: '', duration_country_up: '', duration_city_up: '',
        date_of_shipment: '', date_of_delivery: '', executor: 0, include_archive: false
    }

    const [filterData, setFilterData] = useState(initial_data)
    const [sendFilter, setSendFilter] = useState(false)
    const [filterOpen, setFilterOpen] = useState(false)

    const [selector, setSelector] = useState('client')
    const [content, setContent] = useState(null)

    const [openDialog, setOpenDialog] = useState(false)
    const [dialogTitle, setDialogTitle] = useState('')
    const [dialogData, setDialogData] = useState([])

    const [page, setPage] = useState(1)
    const [countPage, setCountPage] = useState(0)

    const get_overcomes = async (page_size=null) => {
        await api('/api/requests/get_overcomes/', 'GET', {}, false,
            {
                params: { 
                    ...filterData,
                    switcher: selector,
                    page: page_size ? page_size : 1
                },
            }
        ).then((res) => {
            setPage(page_size ? page_size : 1)
            setCountPage(res.data.total_pages)
            setContent(res.data.results)
        })
    }

    useEffect(() => {
        get_overcomes()
    }, [])

    useEffect(() => {
        content &&
            get_overcomes()
    }, [sendFilter, selector])


    const get_dialog_data = (id) => {
        api(`/api/requests/on_it/`, 'GET', {}, false, {
            params: {
                ...filterData,
                ...selector === 'client' ? { client_id: id } : { executor: id },
            }
        }).then(res => setDialogData(res.data.results))
    }

    const handleChangePage = (e, v) => {
        setPage(v)
        get_overcomes(v)
    }

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
                                {selector === 'executor' && <TableCell align="left">Менеджер</TableCell>}
                                <TableCell align="left">Кол-во заказов</TableCell>
                                <TableCell align="left">Фрахт</TableCell>
                                <TableCell align="left">Расходы</TableCell>
                                <TableCell align="left">Прибыль</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {content?.map(el => (
                                <TableRow key={el?.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >

                                    {selector === 'client' && <TableCell align="left" component="th" scope="row">
                                        <Button sx={{ textTransform: 'capitalize' }}
                                            onClick={() => {
                                                setDialogTitle(el.client.company_name)
                                                get_dialog_data(el.client.id)
                                                setOpenDialog(true)
                                            }}
                                        >
                                            {el?.client?.company_name}
                                        </Button>
                                    </TableCell>}

                                    {selector === 'executor' && <TableCell align="left" component="th" scope="row">
                                        <Button sx={{ textTransform: 'capitalize' }}
                                            onClick={() => {
                                                setDialogTitle(`${el.executor.first_name} ${el.executor.last_name}`)
                                                get_dialog_data(el.executor.id)
                                                setOpenDialog(true)
                                            }}
                                        >
                                            {el?.executor?.first_name} {el?.executor?.last_name}
                                        </Button>
                                    </TableCell>}

                                    <TableCell align="left">{el?.count_req}</TableCell>

                                    <TableCell align="left">
                                        {el?.sum_eur && `${el.sum_eur} EUR; `}
                                        {el?.sum_usd && `${el.sum_usd} USD; `}
                                        {el?.sum_rub && `${el.sum_rub} RUB; `}
                                        {el?.sum_byn && `${el.sum_byn} BYN; `}
                                    </TableCell>
                                    <TableCell align="left">
                                        {el?.carrier_eur && `${el.carrier_eur} EUR; `}
                                        {el?.carrier_usd && `${el.carrier_usd} USD; `}
                                        {el?.carrier_rub && `${el.carrier_rub} RUB; `}
                                        {el?.carrier_byn && `${el.carrier_byn} BYN; `}
                                    </TableCell>
                                    <TableCell align="left">
                                        {el.overcome} BYN
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

            {openDialog && <InfoRequestDialog open={openDialog} setOpen={setOpenDialog} title={`Просмотр заявок ${dialogTitle} (${selector === 'client' ? 'клиент' : 'менеджер'})`} dialogData={dialogData} />}
        </Grid>
    )
}