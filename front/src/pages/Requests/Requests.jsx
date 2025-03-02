import * as React from 'react'
import {
    Grid, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, IconButton, Tooltip,
    Link, Pagination
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FireTruckIcon from '@mui/icons-material/FireTruck';
import EditIcon from '@mui/icons-material/Edit';
import EditNoteIcon from '@mui/icons-material/EditNote';
import CreateCarrier from './forms/create_carrier/CreateCarrier';
import TakeToJob from './forms/take_to_job/TakeToJob';
import ChangeDesc from './forms/change_desc/ChangeDesc';
import DeleteRequest from './forms/delete_request/DeleteRequest';
import RequestEdit from './forms/edit_form/RequestEdit';
import ExecutorFilter from '../../components/Filters/ExecutorFilter/ExecutorFilter';
import Loader from '../components/Loader';
import { api } from '../../api/api';
import './requests.css'


export default function Requests({ setAlertInfo }) {
    const [carrierDialog, setCarrierDialog] = React.useState(false)
    const [takeToJobDialog, setTakeToJobDialog] = React.useState(false)
    const [changeDesc, setChangeDesc] = React.useState(false)
    const [deleteRequest, setDeleteRequest] = React.useState(false)
    const [editDialog, setEditDialog] = React.useState(false)
    const [currentReq, setCurrentReq] = React.useState(null)
    const [loader, setLoader] = React.useState(true)
    const [requests, setRequests] = React.useState([])
    const [requestLoad, setRequestLoad] = React.useState(true)

    const [userInfo, setUserInfo] = React.useState(null)
    const [editPoint, setEditPoint] = React.useState('')

    const [filterData, setFilterData] = React.useState({})

    const [page, setPage] = React.useState(1)
    const [countPage, setCountPage] = React.useState(0)

    const fetch_requests = async (page_size = null) => {
        await api(`/api/requests/`, 'GET', {}, false, {
            params: {
                ...filterData,
                page: page_size ? page_size : 1
            }
        }).then((res) => {
            setPage(page_size ? page_size : 1)
            setCountPage(res.data.total_pages)
            setRequests(res.data.results)
            setRequestLoad(false)
        })
    }

    const get_user_info = async () => {
        await api('/auth/users_info/current_user/').then((res) => {
            setUserInfo(res.data)
        })
    }

    React.useEffect(() => {
        const fetch_data = async () => {
            await fetch_requests()
            await get_user_info()
            setLoader(false);
        }
        fetch_data()
    }, [])

    React.useEffect(() => {
        requests &&
            fetch_requests()
    }, [filterData])

    React.useEffect(() => {
        const update_data = async () => {
            await fetch_requests()
            setLoader(false)
        }

        if (loader && requests.length > 0) {
            update_data()
        }
    }, [loader])

    const handleChangePage = (e, v) => {
        setPage(v)
        fetch_requests(v)
    }

    return (
        loader
            ? <Loader />
            : <React.Fragment>
                <Grid container className='navigate_panel_requests' mb={1}>
                    <Grid container item xs={12} md={2} p={0} alignItems={'center'} justifyContent={'center'}>
                        <Link href='/create_request'>
                            <Button variant="outlined" color='success' startIcon={<AddCircleIcon />}>Создать запрос</Button>
                        </Link>
                    </Grid>
                    <Grid container item xs={12} md={10}>
                        {userInfo?.is_staff &&
                            <ExecutorFilter filterData={filterData} setFilterData={setFilterData} />
                        }
                    </Grid>
                </Grid>
                <TableContainer component={Paper}>
                    <Table size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Дата запроса</TableCell>
                                <TableCell align="left">Тип</TableCell>
                                <TableCell align="left">Инфо о грузе</TableCell>
                                <TableCell align="left">Отправляется</TableCell>
                                <TableCell align="left">Прибывает</TableCell>
                                <TableCell align="left">Дата загрузки</TableCell>
                                <TableCell align="left">Дата доставки</TableCell>
                                <TableCell align="left">Клиент</TableCell>
                                <TableCell align="left">Ставка заказчика</TableCell>
                                <TableCell align="left">Ценовые предл-ия</TableCell>
                                <TableCell align="left">Действия</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {requestLoad && <Loader />}
                            {requests.map((req) => (
                                <TableRow
                                    key={req.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">{req.date_of_request}</TableCell>
                                    <TableCell align="left">{req.type_of_transport}</TableCell>
                                    <TableCell align="left">{req.name_of_cargo}</TableCell>
                                    <TableCell align="left">{req.country_of_dispatch} - {req.city_of_dispatch}</TableCell>
                                    <TableCell align="left">{req.delivery_country} - {req.delivery_city}</TableCell>
                                    <TableCell align="left">{req.date_of_shipment}</TableCell>
                                    <TableCell align="left">{req.date_of_delivery}</TableCell>
                                    <TableCell align="left">
                                        {req.client.company_name}
                                        <br />
                                        {req.client.contact_info}
                                    </TableCell>
                                    <TableCell align="left">{req.customer_price} BYN</TableCell>
                                    <TableCell align="left">
                                        {req.carrier_list.map((carr) => (
                                            <React.Fragment>
                                                {carr.contact_info} - {carr.carrier_rate} {carr.carrier_currency}
                                                <br />
                                            </React.Fragment>
                                        ))}

                                    </TableCell>
                                    <TableCell align="left">

                                        <Tooltip title='Взять в работу'>
                                            <IconButton aria-label="take_to_job" className='btn_table'
                                                onClick={() => {
                                                    setTakeToJobDialog(true)
                                                    setCurrentReq(req)
                                                }}
                                            >
                                                <CheckCircleIcon color='success' />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title='Добавить перевозчика'>
                                            <IconButton aria-label="set_carrier" className='btn_table'
                                                onClick={() => {
                                                    setCarrierDialog(true)
                                                    setCurrentReq(req)
                                                }}
                                            >
                                                <FireTruckIcon color='secondary' />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title='Редактировать'>
                                            <IconButton aria-label="edit" className='btn_table'
                                                onClick={() => {
                                                    setEditDialog(true)
                                                    setCurrentReq(req)
                                                }}
                                            >
                                                <EditIcon color='primary' />
                                            </IconButton>
                                        </Tooltip>

                                        <br />

                                        <Tooltip title='Примечание'>
                                            <IconButton aria-label="note" className='btn_table'
                                                onClick={() => {
                                                    setChangeDesc(true)
                                                    setCurrentReq(req)
                                                }}
                                            >
                                                <EditNoteIcon color='third' />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title='Удалить'>
                                            <IconButton aria-label="delete" className='btn_table'
                                                onClick={() => {
                                                    setDeleteRequest(true)
                                                    setCurrentReq(req)
                                                }}
                                            >
                                                <DeleteIcon color='error' />
                                            </IconButton>
                                        </Tooltip>

                                        <br />
                                        <Button variant='contained' color='secondary'
                                            onClick={() => {
                                                setEditDialog(true)
                                                setCurrentReq(req)
                                                setEditPoint('duplicate')
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

                {currentReq &&
                    <React.Fragment>
                        {takeToJobDialog && <TakeToJob setOpen={setTakeToJobDialog} open={takeToJobDialog} currentReq={currentReq} setLoader={setLoader} setAlertInfo={setAlertInfo} setCurrentReq={setCurrentReq} />}
                        {changeDesc && <ChangeDesc setOpen={setChangeDesc} open={changeDesc} currentReq={currentReq} setLoader={setLoader} setAlertInfo={setAlertInfo} setCurrentReq={setCurrentReq} />}
                        {deleteRequest && <DeleteRequest setOpen={setDeleteRequest} open={deleteRequest} currentReq={currentReq} setLoader={setLoader} setAlertInfo={setAlertInfo} setCurrentReq={setCurrentReq} />}
                        {editDialog && <RequestEdit openDialog={editDialog} setOpenDialog={setEditDialog} request={currentReq} point={editPoint} setLoader={setLoader} setCurrentReq={setCurrentReq} />}
                        {carrierDialog && <CreateCarrier open={carrierDialog} setOpen={setCarrierDialog} request={currentReq} setCurrentReq={setCurrentReq} setLoader={setLoader} />}
                    </React.Fragment>
                }
            </React.Fragment>
    )
}