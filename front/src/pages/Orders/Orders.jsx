import * as React from 'react'
import {
    Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, IconButton, Checkbox, Tooltip, Grid
} from '@mui/material'
import EditNoteIcon from '@mui/icons-material/EditNote';
import ErrorMessage from '../../components/ErrorMesage/ErrorMesage'
import ChangeDesc from '../Requests/forms/change_desc/ChangeDesc'
import DeleteRequest from '../Requests/forms/delete_request/DeleteRequest';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RequestEdit from '../Requests/forms/edit_form/RequestEdit';
import DocForm from './forms/docs_dialog/doc_form'
import CompleteOrder from './forms/complete_dialog/complete_dialog';
import ExecutorFilter from '../../components/Filters/ExecutorFilter/ExecutorFilter';
import { useEffect } from 'react'
import { api } from '../../api/api'
import axios from 'axios';

export default function Orders() {
    const [alertInfo, setAlertInfo] = React.useState({ open: false, color: '', message: '' });
    const [loader, setLoader] = React.useState(false)
    const [requests, setRequests] = React.useState(null)
    const [deleteRequest, setDeleteRequest] = React.useState(false)
    const [doc_dialog, setDocDialog] = React.useState(false)
    const [complete_dialog, setCompleteDialog] = React.useState(false)
    const [changeDesc, setChangeDesc] = React.useState(false)
    const [editDialog, setEditDialog] = React.useState(false)
    const [curr_req, setCureReq] = React.useState(null)
    const [userInfo, setUserInfo] = React.useState(null)
    const [executor, setExecutor] = React.useState(null)

    const [EUR, setEUR] = React.useState(0)
    const [USD, setUSD] = React.useState(0)
    const [RUB, setRUB] = React.useState(0)

    useEffect(() => {
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


    useEffect(() => {
        async function fetch_requests() {
            await api(`/api/requests/on_it/`, 'GET').then((res) => {
                setRequests(res.data)
                setLoader(false)
            })
        }

        async function get_user_info() {
            api('/auth/users_info/current_user/').then((res) => {
                setUserInfo(res.data)
            })
        }

        fetch_requests()
        get_user_info()

    }, [loader])

    React.useEffect(() => {
        if (executor !== null) {
            api('/api/requests/on_it/', 'GET', {}, false, {
                params: {
                    'executor': executor
                }
            }).then(res => setRequests(res.data))
        }
    }, [executor])

    function clientPayment(value, req_id) {
        api(`/api/requests/${req_id}/`, 'PATCH', { payment_from_client: value }).then((res) => {
            setAlertInfo({ open: true, color: 'success', message: value ? 'Статус оплаты от клиента установлен!' : 'Статус оплаты от клиента снят!' })
            setLoader(true)
        })
    }

    function carrierPayment(value, req_id) {
        api(`/api/requests/${req_id}/`, 'PATCH', { payment_from_carrier: value }).then((res) => {
            setAlertInfo({ open: true, color: 'success', message: value ? 'Статус оплаты перевозчику установлен!' : 'Статус оплаты перевозчику снят!' })
            setLoader(true)
        })
    }

    const convertCurrency = (amount, currency) => {
        let res
        currency === 'USD' && (res = amount * USD)
        currency === 'EUR' && (res = amount * EUR)
        currency === 'RUB' && (res = amount * RUB / 100)
        currency === 'BYN' && (res = amount)
        return res.toFixed(2);
    };

    return (
        <React.Fragment>
            {userInfo?.is_staff &&
                <Grid container xs={12} p={2} justifyContent={'center'}>
                    <ExecutorFilter setExecutor={setExecutor} executor={executor} />
                </Grid>
            }

            <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Дата загрузки</TableCell>
                            <TableCell align="left">Дата доставки</TableCell>
                            <TableCell align="left">Клиент</TableCell>
                            <TableCell align="left">Инфо о грузе</TableCell>
                            <TableCell align="left">Маршруты</TableCell>
                            <TableCell align="left">Фрахт</TableCell>
                            <TableCell align="left">Прибыль</TableCell>
                            <TableCell align="left">Перевозчик</TableCell>
                            <TableCell align="left"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {requests && requests.map((req) => (
                            <TableRow
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
                                    {Number(convertCurrency(req.customer_price, req.currency)).toFixed(2)} BYN
                                </TableCell>
                                <TableCell align="left">
                                    {Number(convertCurrency(req.customer_price, req.currency) - convertCurrency(req.carrier.carrier_rate, req.carrier.carrier_currency)).toFixed(2)} BYN
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

                                    <Tooltip title="Редактировать">
                                        <IconButton aria-label="edit"
                                            onClick={() => {
                                                setCureReq(req)
                                                setEditDialog(true)
                                            }}
                                        >
                                            <EditIcon color='primary' />
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Поместить в архив">
                                        <IconButton aria-label="delete"
                                            onClick={() => {
                                                setDeleteRequest(true)
                                                setCureReq(req)
                                            }}
                                        >
                                            <DeleteIcon color='error' />
                                        </IconButton>
                                    </Tooltip>

                                    <br />

                                    <Tooltip title="Оплата от клиента">
                                        <Checkbox
                                            checked={req.payment_from_client}
                                            icon={<AccountCircleOutlinedIcon />}
                                            checkedIcon={<AccountCircleIcon color='success' />}
                                            onClick={(v) => { clientPayment(v.target.checked, req.id) }}
                                        />
                                    </Tooltip>

                                    <Tooltip title="Оплата перевозчику">
                                        <Checkbox
                                            checked={req.payment_from_carrier}
                                            icon={<LocalShippingOutlinedIcon />}
                                            checkedIcon={<LocalShippingIcon color='success' />}
                                            onClick={(v) => { carrierPayment(v.target.checked, req.id) }}
                                        />
                                    </Tooltip>

                                    <Tooltip title='Завершить сделку'>
                                        <IconButton aria-label="fingerprint" color="success"
                                            onClick={() => {
                                                setCureReq(req)
                                                setCompleteDialog(true)
                                            }}>
                                            <TaskAltOutlinedIcon />
                                        </IconButton>
                                    </Tooltip>

                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {curr_req &&
                <React.Fragment>
                    <DocForm doc_dialog={doc_dialog} setDocDialog={setDocDialog} curr_req={curr_req} setAlertInfo={setAlertInfo} setCurrentReq={setCureReq} />
                    <ChangeDesc open={changeDesc} setOpen={setChangeDesc} currentReq={curr_req} setLoader={setLoader} setAlertInfo={setAlertInfo} setCurrentReq={setCureReq} />
                    <DeleteRequest open={deleteRequest} setOpen={setDeleteRequest} currentReq={curr_req} setLoader={setLoader} setAlertInfo={setAlertInfo} point={'orders'} setCurrentReq={setCureReq} />
                    <RequestEdit openDialog={editDialog} setOpenDialog={setEditDialog} request={curr_req} point={'orders'} setLoader={setLoader} setCurrentReq={setCureReq} />
                    <CompleteOrder open={complete_dialog} setOpen={setCompleteDialog} request={curr_req} setLoader={setLoader} setCurrentReq={setCureReq} setAlertInfo={setAlertInfo} />
                </React.Fragment>
            }

            <ErrorMessage alertInfo={alertInfo} setAlertInfo={setAlertInfo} />
        </React.Fragment>
    )
}