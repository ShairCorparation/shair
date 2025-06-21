import * as React from 'react';
import {
    TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Grid, Button, Pagination,
    Tooltip, IconButton
} from '@mui/material'
import ErrorMessage from '../../components/ErrorMesage/ErrorMesage';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';
import EditIcon from '@mui/icons-material/Edit';
import { api } from '../../api/api'
import NoteForm from './forms/note_form/NoteForm';
import EditForm from './forms/edit_form/EditForm';
import DeleteForm from './forms/delete_form/DeleteForm';
import Filter from './filters/Filter';
import Loader from '../components/Loader'
import ClientAndCarrierDialog from '../../components/ClientAndCarrierDialog/ClientAndCarrierDialog';


export default function Carriers() {
    const [curr_carrier, setCurrCarrier] = React.useState(null)
    const [carriers, setCarrier] = React.useState(null)
    const [loader, setLoader] = React.useState(true)

    const [note_dialog, setNoteDialog] = React.useState(false)
    const [edit_dialog, setEditDialog] = React.useState(false)
    const [delete_dialog, setDeleteDialog] = React.useState(false)
    const [alertInfo, setAlertInfo] = React.useState({ open: false, color: '', message: '' });

    const initial_data = {
        company_name: '', unp: '', created_date_from: '', created_date_up: '',
        duration_country_from: '', duration_country_up: '', duration_city_from: '', duration_city_up: '',
        request_date_from: '', request_date_up: ''
    }
    const [filterData, setFilterData] = React.useState(initial_data)
    const [filterOpen, setFilterOpen] = React.useState(false)
    const [sendFilter, setSendFilter] = React.useState(false)

    const [openDialog, setOpenDialog] = React.useState(false)
    const [dialogData, setDialogData] = React.useState([])

    const [page, setPage] = React.useState(1)
    const [countPage, setCountPage] = React.useState(0)


    const get_carriers = async (page_size = null) => {
        await api(`/api/carriers/`, 'GET', {}, false,
            {
                params: { ...filterData, page: page_size ? page_size : 1 }
            }
        ).then((res) => {
            setPage(page_size ? page_size : 1)
            setCarrier(res.data.results)
            setCountPage(res.data.total_pages)
            setLoader(false)
        })
    }

    React.useEffect(() => {
        get_carriers()
    }, [loader])

    React.useEffect(() => {
        carriers &&
            get_carriers()
    }, [sendFilter])

    const get_dialog_data = (id) => {
        api(`/api/requests/view_request_by_carrier_or_client/`, 'GET', {}, false, {
            params: {
                'carrier_id': id
            }
        }).then(res => {
            setDialogData(res.data)
            setOpenDialog(true)
        })
    }

    const handleChangePage = (e, v) => {
        setPage(v)
        get_carriers(v)
    }

    return (
        loader ? <Loader />
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

                    <Grid item xs={12}>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table" size='small'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">Название компании</TableCell>
                                        <TableCell align="left">Контактное лицо</TableCell>
                                        <TableCell align="left">УНП</TableCell>
                                        <TableCell align="left">Контактная ифнормация</TableCell>
                                        <TableCell align="left">Кол-во поездок</TableCell>
                                        <TableCell align="left">Действия</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {carriers?.map((carrier) => (
                                        <TableRow key={carrier.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell component="th" scope="row">
                                                {carrier.company_name}
                                                <br />
                                                {carrier?.note !== "" && <EditNoteIcon />}
                                            </TableCell>
                                            <TableCell align="left">
                                                <Button sx={{ textTransform: 'capitalize' }} onClick={() => {
                                                    get_dialog_data(carrier.id)
                                                }}>{carrier.contact_person}</Button>
                                            </TableCell>
                                            <TableCell align="left">{carrier.unp}</TableCell>
                                            <TableCell align="left">{carrier.contact_info}</TableCell>
                                            <TableCell align="left">{carrier.count_request}</TableCell>
                                            <TableCell align="left">

                                                <Tooltip title='Примечание'>
                                                    <IconButton aria-label="delete">
                                                        <EditNoteIcon
                                                            onClick={() => {
                                                                setCurrCarrier(carrier)
                                                                setNoteDialog(true)
                                                            }}
                                                        />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title='Редактировать'>
                                                    <IconButton aria-label="delete">
                                                        <EditIcon
                                                            onClick={() => {
                                                                setCurrCarrier(carrier)
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
                                                                setCurrCarrier(carrier)
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

                        {curr_carrier &&
                            <React.Fragment>
                                <NoteForm setLoader={setLoader} open={note_dialog} setOpen={setNoteDialog} carrier={curr_carrier} setAlertInfo={setAlertInfo} setCurrCarrier={setCurrCarrier} />
                                <EditForm setLoader={setLoader} open={edit_dialog} setOpen={setEditDialog} carrier={curr_carrier} setAlertInfo={setAlertInfo} setCurrCarrier={setCurrCarrier} />
                                <DeleteForm setLoader={setLoader} open={delete_dialog} setOpen={setDeleteDialog} carrier={curr_carrier} setAlertInfo={setAlertInfo} setCurrClient={setCurrCarrier} />
                            </React.Fragment>
                        }

                        <ErrorMessage alertInfo={alertInfo} setAlertInfo={setAlertInfo} />
                    </Grid>
                </Grid>
                {openDialog && <ClientAndCarrierDialog open={openDialog} setOpen={setOpenDialog} dialogData={dialogData} title={'Просмотр заявок'} />}

            </React.Fragment>
    )
}