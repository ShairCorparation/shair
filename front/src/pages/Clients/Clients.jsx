import {
    Grid, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Tooltip,
    IconButton, Button, Pagination
} from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import EditIcon from '@mui/icons-material/Edit';
import NoteForm from './forms/note_form/NoteForm';
import AddIcon from '@mui/icons-material/Add';
import EditForm from './forms/edit_form/EditForm';
import DeleteForm from './forms/delete_form/DeleteForm';
import ErrorMessage from '../../components/ErrorMesage/ErrorMesage'
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import Filter from './filters/Filter';
import AddForm from './forms/add_form/AddForm';
import * as React from 'react';
import { api } from '../../api/api';
import ClientAndCarrierDialog from '../../components/ClientAndCarrierDialog/ClientAndCarrierDialog';
import Loader from '../components/Loader';

export default function Clients() {
    const initial_data = {
        company_name: '', unp: '', created_date_from: '', created_date_up: '',
        duration_country_from: '', duration_country_up: '', duration_city_from: '', duration_city_up: '',
        request_date_from: '', request_date_up: '', delivery_date_from: '', delivery_date_up: ''
    }

    const [loader, setLoader] = React.useState(true)
    const [clients, setClients] = React.useState(null)
    const [alertInfo, setAlertInfo] = React.useState({ open: false, color: '', message: '' });
    const [curr_client, setCurrClient] = React.useState(null)
    const [note_dialog, setNoteDialog] = React.useState(false)
    const [edit_dialog, setEditDialog] = React.useState(false)
    const [delete_dialog, setDeleteDialog] = React.useState(false)

    const [add_dialog, setAddDialog] = React.useState(false)

    const [openDialog, setOpenDialog] = React.useState(false)
    const [dialogData, setDialogData] = React.useState([])

    const [filterData, setFilterData] = React.useState(initial_data)
    const [filterOpen, setFilterOpen] = React.useState(false)
    const [sendFilter, setSendFilter] = React.useState(false)

    const [page, setPage] = React.useState(1)
    const [countPage, setCountPage] = React.useState(0)

    const get_clients = async (page_size = null) => {
        await api(`/api/clients/`, 'GET', {}, false,
            {
                params: { ...filterData, page: page_size ? page_size : 1 }
            }
        ).then((res) => {
            setPage(page_size ? page_size : 1)
            setClients(res.data.results)
            setCountPage(res.data.total_pages)
            setLoader(false)
        })
    }

    React.useEffect(() => {
        get_clients()
    }, [loader])

    React.useEffect(() => {
        clients &&
            get_clients()
    }, [sendFilter])

    const get_dialog_data = (id) => {
        api(`/api/requests/view_request_by_carrier_or_client/`, 'GET', {}, false, {
            params: {
                'client_id': id
            }
        }).then(res => setDialogData(res.data))
    }


    const handleChangePage = (e, v) => {
        setPage(v)
        get_clients(v)
    }

    return (
        loader ?
            <Loader />
            : <React.Fragment>
                <Grid container p={1}>
                    <Grid item xs={12} component={Paper} mb={1}>
                        <Button onClick={() => setFilterOpen(!filterOpen)} color='secondary'><FilterAltIcon />
                            {filterOpen ? 'Скрыть фильтры' : 'Показать фильтры'}
                        </Button>
                        {filterOpen &&
                            <Filter setFilterData={setFilterData} filterData={filterData}
                                setSendFilter={setSendFilter} sendFilter={sendFilter} initial_data={initial_data} />
                        }
                    </Grid>

                    <Grid item xs={12} mb={1}>
                        <Tooltip title='Новый клиент'>
                            <Button aria-label="new_client" color='success' variant='contained'
                                onClick={() => setAddDialog(true)}
                            >
                                <AddIcon /> Новый клиент
                            </Button>
                        </Tooltip>
                    </Grid>

                    <Grid item xs={12}>

                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table" size='small'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">Название компании</TableCell>
                                        <TableCell align="left">Контактное лицо</TableCell>
                                        <TableCell align="left">УНП клиента</TableCell>
                                        <TableCell align="left">Контактная информация</TableCell>
                                        <TableCell align="left">Кол-во заказов</TableCell>
                                        <TableCell align="left">Действия</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {clients?.map((client) => (
                                        <TableRow
                                            key={client?.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {client?.company_name}
                                                <br />
                                                {client?.note !== "" && <EditNoteIcon />}
                                            </TableCell>
                                            <TableCell >
                                                <Button sx={{ textTransform: 'capitalize' }} onClick={() => {
                                                    get_dialog_data(client.id)
                                                    setOpenDialog(true)
                                                }}>{client?.contact_person}</Button>
                                            </TableCell>
                                            <TableCell >{client?.unp}</TableCell>
                                            <TableCell >{client?.contact_info}</TableCell>
                                            <TableCell >{client?.count_request}</TableCell>
                                            <TableCell >
                                                <Tooltip title='Примечание'>
                                                    <IconButton aria-label="delete">
                                                        <EditNoteIcon
                                                            onClick={() => {
                                                                setCurrClient(client)
                                                                setNoteDialog(true)
                                                            }}
                                                        />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title='Редактировать'>
                                                    <IconButton aria-label="delete">
                                                        <EditIcon
                                                            onClick={() => {
                                                                setCurrClient(client)
                                                                setEditDialog(true)
                                                            }}
                                                        />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title='Удаление'>
                                                    <IconButton aria-label="delete">
                                                        <DeleteIcon
                                                            color='error'
                                                            onClick={() => {
                                                                setCurrClient(client)
                                                                setDeleteDialog(true)
                                                            }}
                                                        />
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
                        {curr_client &&
                            <React.Fragment>
                                <NoteForm setLoader={setLoader} open={note_dialog} setOpen={setNoteDialog} client={curr_client} setAlertInfo={setAlertInfo} setCurrClient={setCurrClient} />
                                <EditForm setLoader={setLoader} open={edit_dialog} setOpen={setEditDialog} client={curr_client} setAlertInfo={setAlertInfo} setCurrClient={setCurrClient} />
                                <DeleteForm setLoader={setLoader} open={delete_dialog} setOpen={setDeleteDialog} client={curr_client} setAlertInfo={setAlertInfo} setCurrClient={setCurrClient} />
                            </React.Fragment>
                        }
                        <AddForm setLoader={setLoader} open={add_dialog} setOpen={setAddDialog} setAlertInfo={setAlertInfo} />
                        <ErrorMessage alertInfo={alertInfo} setAlertInfo={setAlertInfo} />
                    </Grid>
                </Grid>

                {openDialog && <ClientAndCarrierDialog open={openDialog} setOpen={setOpenDialog} dialogData={dialogData} title={'Просмотр заявок'} />}
            </React.Fragment>
    )
}