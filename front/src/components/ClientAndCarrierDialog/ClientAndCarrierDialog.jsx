import React from 'react'
import { Dialog, DialogTitle, DialogContent, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'

const headCells = [
    { id: 'date_of_shipment', label: 'Дата загрузки' },
    { id: 'date_of_delivery', label: 'Дата доставки' },
    { id: 'client', label: 'Клиент' },
    { id: 'info', label: 'Инфо о грузе' },
    { id: 'country_of_dispatch', label: 'Маршруты' },
    { id: 'customer_price', label: 'Фрахт' },
    { id: 'carrier', label: 'Перевозчик' },
    { id: 'executor', label: 'Менеджер' },
]

export default function ClientAndCarrierDialog({ open, setOpen, title, dialogData }) {

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth={'1200px'}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {title}
                </DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper}>
                        <Table size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow >
                                    {headCells.map(el => (
                                        <TableCell>
                                            {el.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dialogData.map((req) => (
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
                                            {req.customer_price} {req.currency}
                                        </TableCell>

                                        <TableCell align="left">
                                            {req.carrier.company_name}
                                            <br />
                                            {req.carrier.contact_info}
                                        </TableCell>

                                        <TableCell align="left">
                                            {req.executor.first_name} {req.executor.last_name}
                                        </TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    )
}
