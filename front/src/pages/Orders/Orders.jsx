import * as React from 'react'
import {
    Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableSortLabel, TableBody, Button, IconButton, Checkbox, Tooltip, Grid,
    Pagination
} from '@mui/material'
import ChangeDesc from '../Requests/forms/change_desc/ChangeDesc'
import DeleteRequest from '../Requests/forms/delete_request/DeleteRequest';
import RequestEdit from '../Requests/forms/edit_form/RequestEdit';
import {
    EditNote, LocalShippingOutlined, TaskAltOutlined, LocalShipping, AccountCircleOutlined, AccountCircle,
    AssignmentTurnedInOutlined, AssignmentTurnedIn, Edit, Delete
} from '@mui/icons-material'
import DocForm from './forms/docs_dialog/doc_form'
import ExecutorFilter from '../../components/Filters/ExecutorFilter/ExecutorFilter';
import { convertCurrency } from '../../components/helpers/help_functions';
import ErrorMessage from '../../components/ErrorMesage/ErrorMesage'
import InfoDialog from '../../components/InfoDialog/InfoDialog';
import Loader from '../components/Loader';
import { api } from '../../api/api'
import './orders.css'


const headCells = [
    { id: 'date_of_shipment', label: 'Дата загрузки', sort: true },
    { id: 'date_of_delivery', label: 'Дата доставки', sort: true },
    { id: 'client', label: 'Клиент', sort: true },
    { id: 'info', label: 'Инфо о грузе' },
    { id: 'country_of_dispatch', label: 'Маршруты' },
    { id: 'customer_price', label: 'Фрахт' },
    { id: 'benefit', label: 'Прибыль' },
    { id: 'carrier', label: 'Перевозчик', sort: true },
]

export default function Orders() {
    const [alertInfo, setAlertInfo] = React.useState({ open: false, color: '', message: '' });
    const [loader, setLoader] = React.useState(true)
    const [requests, setRequests] = React.useState([])

    const [deleteRequest, setDeleteRequest] = React.useState(false)
    const [doc_dialog, setDocDialog] = React.useState(false)
    const [complete_dialog, setCompleteDialog] = React.useState(false)
    const [changeDesc, setChangeDesc] = React.useState(false)
    const [editDialog, setEditDialog] = React.useState(false)
    const [receiveDoc, setReceiveDoc] = React.useState(false)

    const [curr_req, setCureReq] = React.useState(null)
    const [userInfo, setUserInfo] = React.useState(null)

    const [EUR, setEUR] = React.useState(0)
    const [USD, setUSD] = React.useState(0)
    const [RUB, setRUB] = React.useState(0)

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('date_of_shipment');

    const [filterData, setFilterData] = React.useState({})

    const [page, setPage] = React.useState(1)
    const [countPage, setCountPage] = React.useState(0)

    const get_currency = async () => {
        await api('/api/get_currency/', 'GET').then((res) => {
            setEUR(res.data['EUR'])
            setUSD(res.data['USD'])
            setRUB(res.data['RUB'])
        })
    }

    const get_projects = async (ordering = null, page_size = null) => {
        await api(`/api/requests/on_it/`, 'GET', {}, false, {
            params: {
                ...filterData,
                'ordering': ordering ? ordering : `${order === 'desc' ? '-' : ''}${orderBy}`,
                page: page_size ? page_size : 1
            }
        }).then((res) => {
            setPage(page_size ? page_size : 1)
            setCountPage(res.data.total_pages)
            setRequests(res.data.results)
        })
    }

    const get_user_info = async () => {
        await api('/auth/users_info/current_user/').then((res) => {
            setUserInfo(res.data)
        })
    }

    React.useEffect(() => {
        const fetch_data = async () => {
            await get_currency()
            await get_projects()
            await get_user_info()
            setLoader(false)
        }

        fetch_data()
    }, [])

    React.useEffect(() => {
        const update_data = async () => {
            await get_projects()
            setLoader(false)
        }

        loader && requests.length > 0 && update_data()
    }, [loader])

    React.useEffect(() => {
        requests &&
            get_projects()
    }, [filterData])

    const clientPayment = (value, req_id) => {
        api(`/api/requests/${req_id}/`, 'PATCH', { payment_from_client: value }).then((res) => {
            setAlertInfo({ open: true, color: 'success', message: value ? 'Статус оплаты от клиента установлен!' : 'Статус оплаты от клиента снят!' })
            setLoader(true)
        })
    }

    const carrierPayment = (value, req_id) => {
        api(`/api/requests/${req_id}/`, 'PATCH', { payment_from_carrier: value }).then((res) => {
            setAlertInfo({ open: true, color: 'success', message: value ? 'Статус оплаты перевозчику установлен!' : 'Статус оплаты перевозчику снят!' })
            setLoader(true)
        })
    }

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        get_projects(`${isAsc ? '-' : ''}${property}`)
    };

    const order_complete = () => {
        if (curr_req.payment_from_carrier && curr_req.payment_from_client) {
            api(`/api/requests/${curr_req.id}/`, 'PATCH', { status: 'complete' }).then(() => {
                setCompleteDialog(false)
                setLoader(true)
            })
        }
        else {
            setAlertInfo({ open: complete_dialog, color: 'error', message: 'Не проведена оплата по клиенту или перевозчику!' })
        }
    }

    const set_receive_doc = () => {
        api(`/api/requests/${curr_req.id}/set_receive_doc_date/`, 'PATCH').then(() => {
            setReceiveDoc(false)
            setAlertInfo({ open: true, color: 'success', message: 'Статус получения документов установлен!' })
            setLoader(true)
        })
    }

    const handleChangePage = (e, v) => {
        setPage(v)
        get_projects(null, v)
    }

    return (
        loader
            ? <Loader />
            : <React.Fragment>
                {userInfo?.is_staff &&
                    <Grid container xs={12} p={2} justifyContent={'center'}>
                        <ExecutorFilter filterData={filterData} setFilterData={setFilterData} />
                    </Grid>
                }

                <TableContainer component={Paper}>
                    <Table size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow >
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
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {requests.map((req) => (
                                <TableRow
                                    className={
                                        req.receive_doc_status === 'easy'
                                            ? 'easy_row'
                                            : req.receive_doc_status === 'medium'
                                                ? 'medium_row'
                                                : req.receive_doc_status === 'hard'
                                                    ? 'hard_row'
                                                    : ''
                                    }
                                    key={req.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">{req.date_of_shipment}</TableCell>
                                    <TableCell align="left">{req.date_of_delivery}</TableCell>
                                    <TableCell align="left">
                                        {req.client.company_name}
                                        <br />
                                        {req.client.contact_info}
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
                                        {Number(convertCurrency(req.customer_price, req.currency, USD, EUR, RUB))} BYN
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

                                        <Tooltip title="Документы полученные заказчиком">
                                            <IconButton aria-label="note"
                                                onClick={() => {
                                                    (!req.receive_doc_date || req.receive_doc_date === '') && setReceiveDoc(true)
                                                    setCureReq(req)
                                                }}
                                            >
                                                {(!req.receive_doc_date || req.receive_doc_date === '')
                                                    ? <AssignmentTurnedInOutlined color='success' />
                                                    : <AssignmentTurnedIn color='success' />
                                                }
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Примечание">
                                            <IconButton aria-label="note"
                                                onClick={() => {
                                                    setChangeDesc(true)
                                                    setCureReq(req)
                                                }}
                                            >

                                                <EditNote color='third' />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Редактировать">
                                            <IconButton aria-label="edit"
                                                onClick={() => {
                                                    setCureReq(req)
                                                    setEditDialog(true)
                                                }}
                                            >
                                                <Edit color='primary' />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Поместить в архив">
                                            <IconButton aria-label="delete"
                                                onClick={() => {
                                                    setDeleteRequest(true)
                                                    setCureReq(req)
                                                }}
                                            >
                                                <Delete color='error' />
                                            </IconButton>
                                        </Tooltip>

                                        <br />

                                        <Tooltip title="Оплата от клиента">
                                            <Checkbox
                                                checked={req.payment_from_client}
                                                icon={<AccountCircleOutlined />}
                                                checkedIcon={<AccountCircle color='success' />}
                                                onClick={(v) => { clientPayment(v.target.checked, req.id) }}
                                            />
                                        </Tooltip>

                                        <Tooltip title="Оплата перевозчику">
                                            <Checkbox
                                                checked={req.payment_from_carrier}
                                                icon={<LocalShippingOutlined />}
                                                checkedIcon={<LocalShipping color='success' />}
                                                onClick={(v) => { carrierPayment(v.target.checked, req.id) }}
                                            />
                                        </Tooltip>

                                        <Tooltip title='Завершить сделку'>
                                            <IconButton aria-label="fingerprint" color="success"
                                                onClick={() => {
                                                    setCureReq(req)
                                                    setCompleteDialog(true)
                                                }}>
                                                <TaskAltOutlined />
                                            </IconButton>
                                        </Tooltip>

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
                        {doc_dialog && <DocForm doc_dialog={doc_dialog} setDocDialog={setDocDialog} curr_req={curr_req} setAlertInfo={setAlertInfo} setCurrentReq={setCureReq} />}
                        {changeDesc && <ChangeDesc open={changeDesc} setOpen={setChangeDesc} currentReq={curr_req} setLoader={setLoader} setAlertInfo={setAlertInfo} setCurrentReq={setCureReq} />}
                        {deleteRequest && <DeleteRequest open={deleteRequest} setOpen={setDeleteRequest} currentReq={curr_req} setLoader={setLoader} setAlertInfo={setAlertInfo} point={'orders'} setCurrentReq={setCureReq} />}
                        {editDialog && <RequestEdit openDialog={editDialog} setOpenDialog={setEditDialog} request={curr_req} point={'orders'} setLoader={setLoader} setCurrentReq={setCureReq} />}
                        {complete_dialog && <InfoDialog open={complete_dialog} setOpen={setCompleteDialog} name={curr_req?.name_of_cargo} successFunc={order_complete} textType={'complete_order'} />}
                        {receiveDoc && <InfoDialog open={receiveDoc} setOpen={setReceiveDoc} successFunc={set_receive_doc} textType={'set_receive_doc'} />}
                    </React.Fragment>
                }
                <ErrorMessage alertInfo={alertInfo} setAlertInfo={setAlertInfo} />
            </React.Fragment>
    )
}