import * as React from 'react'
import {
    Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, IconButton, Checkbox, Tooltip, Grid, TableSortLabel,
    Pagination
} from '@mui/material'
import EditNoteIcon from '@mui/icons-material/EditNote';
import ErrorMessage from '../../components/ErrorMesage/ErrorMesage'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DocForm from '../Orders/forms/docs_dialog/doc_form';
import ChangeDesc from '../Requests/forms/change_desc/ChangeDesc';
import ExecutorFilter from '../../components/Filters/ExecutorFilter/ExecutorFilter';
import RequestEdit from '../Requests/forms/edit_form/RequestEdit';
import { convertCurrency } from '../../components/helpers/help_functions';
import Loader from '../components/Loader';
import { useEffect } from 'react'
import { api } from '../../api/api'


const headCells = [
    { id: 'date_of_shipment', label: 'Дата загрузки', sort: true },
    { id: 'date_of_delivery', label: 'Дата доставки', sort: true },
    { id: 'client__company_name', label: 'Клиент', sort: true },
    { id: 'info', label: 'Инфо о грузе' },
    { id: 'country_of_dispatch', label: 'Маршруты' },
    { id: 'customer_price', label: 'Фрахт' },
    { id: 'benefit', label: 'Прибыль' },
    { id: 'carrier__carrier_id__company_name', label: 'Перевозчик', sort: true },
]

export default function Archive() {
    const [loader, setLoader] = React.useState(true)
    const [alertInfo, setAlertInfo] = React.useState({ open: false, color: '', message: '' });
    const [requests, setRequests] = React.useState(null)
    const [doc_dialog, setDocDialog] = React.useState(false)
    const [changeDesc, setChangeDesc] = React.useState(false)
    const [curr_req, setCureReq] = React.useState(null)

    const [filterData, setFilterData] = React.useState({})
    const [userInfo, setUserInfo] = React.useState(null)

    const [openEditDialog, setOpenEditDialog] = React.useState(false)

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('date_of_shipment');

    const [page, setPage] = React.useState(1)
    const [countPage, setCountPage] = React.useState(0)

    const [EUR, setEUR] = React.useState(0)
    const [USD, setUSD] = React.useState(0)
    const [RUB, setRUB] = React.useState(0)

    const get_currency = async () => {
        await api('/api/get_currency/', 'GET').then((res) => {
            setEUR(res.data['EUR'])
            setUSD(res.data['USD'])
            setRUB(res.data['RUB'])
        })
    }

    const get_requests = async (ordering = null, page_size = null) => {
        api('/api/requests/archived/', 'GET', {}, false, {
            params: {
                ...filterData,
                'ordering': ordering ? ordering : `${order === 'desc' ? '-' : ''}${orderBy}`,
                page: page_size ? page_size : 1
            }
        }).then(res => {
            setPage(page_size ? page_size : 1)
            setRequests(res.data.results)
            setCountPage(res.data.total_pages)
        })
    }

    const get_user = async () => {
        await api('/auth/users_info/current_user/').then((res) => {
            setUserInfo(res.data)
        })
    }

    useEffect(() => {
        const fetch_data = async () => {
            await get_currency()
            await get_requests()
            await get_user()
            setLoader(false)
        }
        fetch_data()
    }, [])

    useEffect(() => {
        requests &&
            get_requests()
    }, [filterData])

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        get_requests(`${isAsc ? '-' : ''}${property}`)
    };

    const handleChangePage = (e, v) => {
        setPage(v)
        get_requests(null, v)
    }

    return (
        loader ? <Loader />
            : <React.Fragment>

                <Grid container xs={12} p={2} justifyContent={'center'}>
                    <ExecutorFilter filterData={filterData} setFilterData={setFilterData} />
                </Grid>

                <TableContainer component={Paper}>
                    <Table size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                {headCells.map(el => (
                                    <TableCell>
                                        {el.sort
                                            ? <TableSortLabel
                                                key={el.id}
                                                active={orderBy === el.id}
                                                direction={orderBy === el.id ? order : 'asc'}
                                                onClick={() => handleRequestSort(el.id)}>
                                                {el.label}
                                            </TableSortLabel>
                                            : el.label
                                        }
                                    </TableCell>

                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {requests && requests.map((req) => (
                                <TableRow
                                    key={req.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">{req?.date_of_shipment}</TableCell>
                                    <TableCell align="left">{req?.date_of_delivery}</TableCell>
                                    <TableCell align="left">
                                        {req?.client.company_name}
                                        <br />
                                        {req?.client.contact_info}
                                    </TableCell>
                                    <TableCell align="left">
                                        {req.volume !== '' && `Объем: ${req.volume}; `}
                                        {req.width !== '' && `Ширина: ${req.width}; `}
                                        {req.height !== '' && `Высота: ${req.height}; `}
                                        <br />
                                        {req.yardage !== '' && `Длина: ${req.yardage}; `}
                                        {req.weight !== '' && `Вес: ${req.weight}; `}
                                        {req.pallets !== '' && `Палеты: ${req.pallets}; `}
                                    </TableCell>
                                    <TableCell align="left">{req.country_of_dispatch} - {req.city_of_dispatch} / {req.delivery_country} - {req.delivery_city}</TableCell>

                                    <TableCell align="left">
                                        {Number(convertCurrency(req.customer_price, req.currency, USD, EUR, RUB)).toFixed(2)} BYN
                                    </TableCell>
                                    <TableCell align="left">
                                        {Number(convertCurrency(req.customer_price, req.currency, USD, EUR, RUB) - Number(convertCurrency(req.carrier.carrier_rate, req.carrier.carrier_currency, USD, EUR, RUB))).toFixed(2)} BYN
                                    </TableCell>
                                    <TableCell align="left">
                                        {req.carrier.company_name}
                                        <br />
                                        {req.carrier.contact_info}
                                    </TableCell>
                                    <TableCell align='center'>
                                        <Button variant='contained' color='primary'
                                            onClick={() => {
                                                setDocDialog(true)
                                                setCureReq(req)
                                            }}>
                                            Документы
                                        </Button>
                                        <br />

                                        <Tooltip title="Примечание">
                                            <IconButton aria-label="note"
                                                onClick={() => {
                                                    setChangeDesc(true)
                                                    setCureReq(req)
                                                }}
                                            >

                                                <EditNoteIcon color='third' />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Оплата от клиента">
                                            <Checkbox
                                                checked={req.payment_from_client}
                                                icon={<AccountCircleOutlinedIcon />}
                                                checkedIcon={<AccountCircleIcon color='success' />}
                                            />
                                        </Tooltip>

                                        <Tooltip title="Оплата перевозчику">
                                            <Checkbox
                                                checked={req.payment_from_carrier}
                                                icon={<LocalShippingOutlinedIcon />}
                                                checkedIcon={<LocalShippingIcon color='success' />}
                                            />
                                        </Tooltip>
                                        <br />

                                        <Button variant='contained' color='secondary'
                                            onClick={() => {
                                                setOpenEditDialog(true)
                                                setCureReq(req)
                                            }}>
                                            Дублировать
                                        </Button>

                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Grid container p={1} justifyContent={'flex-end'}>
                    <Pagination shape="rounded" variant='outlined' color='secondary' page={page} count={countPage} onChange={handleChangePage} />
                </Grid>

                {curr_req &&
                    <React.Fragment>
                        <DocForm doc_dialog={doc_dialog} setDocDialog={setDocDialog} curr_req={curr_req} setAlertInfo={setAlertInfo} setCurrentReq={setCureReq} purpose={'archive'} />
                        <ChangeDesc open={changeDesc} setOpen={setChangeDesc} currentReq={curr_req} setAlertInfo={setAlertInfo} setCurrentReq={setCureReq} purpose={'archive'} />
                        <RequestEdit request={curr_req} openDialog={openEditDialog} setOpenDialog={setOpenEditDialog} point='duplicate' setCurrentReq={setCureReq} />
                    </React.Fragment>
                }

                <ErrorMessage alertInfo={alertInfo} setAlertInfo={setAlertInfo} />
            </React.Fragment>
    )
}