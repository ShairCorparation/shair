import * as React from 'react'
import {
    Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, IconButton, Checkbox, Tooltip
} from '@mui/material'
import EditNoteIcon from '@mui/icons-material/EditNote';
import ErrorMessage from '../../components/ErrorMesage/ErrorMesage'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DocForm from '../Orders/forms/docs_dialog/doc_form';
import ChangeDesc from '../Requests/forms/change_desc/ChangeDesc';
import { useEffect } from 'react'
import { api } from '../../api/api'
import axios from 'axios';

export default function Archive() {
    const [alertInfo, setAlertInfo] = React.useState({ open: false, color: '', message: '' });
    const [loader, setLoader] = React.useState(false)
    const [requests, setRequests] = React.useState(null)
    const [doc_dialog, setDocDialog] = React.useState(false)
    const [changeDesc, setChangeDesc] = React.useState(false)
    const [curr_req, setCureReq] = React.useState(null)

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
        api(`/api/requests/archived/`, 'GET').then((res) => {
            setRequests(res.data)
            setLoader(false)
        })

    }, [loader])


    const convertCurrency = (amount, currency) => {
        let res
        currency === 'USD' && (res = amount * USD)
        currency === 'EUR' && (res = amount * EUR)
        currency === 'RUB' && (res = amount * RUB / 100)
        return res;
      };

    return (
        <React.Fragment>

            <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Номер заказа</TableCell>
                            <TableCell align="left">Дата заказа</TableCell>
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
                                <TableCell component="th" scope="row">#{req.id}</TableCell>
                                <TableCell align="left">{req.date_of_request}</TableCell>
                                <TableCell align="left">
                                    {req.client.contact_person}
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
                                    {Number(convertCurrency(req.customer_price, req.currency) - convertCurrency(req.carrier.rate, req.carrier.currency)).toFixed(2)} BYN
                                </TableCell>
                                <TableCell align="left">
                                    {req.carrier.contact_person}
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

                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {curr_req &&
                <React.Fragment>
                    <DocForm doc_dialog={doc_dialog} setDocDialog={setDocDialog} curr_req={curr_req} setAlertInfo={setAlertInfo} setCurrentReq={setCureReq} purpose={'archive'}/>
                    <ChangeDesc open={changeDesc} setOpen={setChangeDesc} currentReq={curr_req} setLoader={setLoader} setAlertInfo={setAlertInfo} setCurrentReq={setCureReq} purpose={'archive'}/>
                </React.Fragment>
            }

            <ErrorMessage alertInfo={alertInfo} setAlertInfo={setAlertInfo} />
        </React.Fragment>
    )
}