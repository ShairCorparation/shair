import {
    Grid, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
    FormControl, InputLabel, MenuItem, Select
} from '@mui/material'
import FormError from '../../../../components/FormError/FormError';
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { api } from '../../../../api/api';
import './take_to_job.css'


export default function TakeToJob({ setOpen, open, currentReq, setLoader, setAlertInfo, setCurrentReq }) {
    const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onSubmit' })

    const [carriers, setCarriers] = useState(null)
    const [rate, setRate] = useState(0)
    const [currency, setCurrency] = useState('')
    const [loadCarrier, setLoaderCarrier] = useState(false)

    const handleClose = () => {
        setOpen(false);
        setCurrentReq(null)
    };


    const handleSave = (form_data) => {

        api(`/api/request_carriers/${form_data.carrier}/`, 'PATCH', {
            'carrier_rate': rate,
            'carrier_currency': currency
        })
        const data = { carrier: form_data.carrier, status: 'on it'}
        api(`/api/requests/${currentReq.id}/take_to_job/`, 'PATCH', data)
            .then((res) => {
                setAlertInfo({ open: open, color: 'success', message: res.data.message })
                setLoader(true)
                handleClose()
            })
            .catch((err) => {
                setAlertInfo({ open: open, color: 'error', message: err.response.data.unp[0] })
            })
    }

    useEffect(() => {
        setCarriers(currentReq.carrier_list) 
        setLoaderCarrier(false)
    }, [loadCarrier, currentReq])

    return (
        <Dialog
            maxWidth={'500px'}
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <form onSubmit={handleSubmit(handleSave)} className='form_take_to_job'>
                <DialogTitle id="alert-dialog-title">
                    {"Взять в работу?"}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={1} p={1}>

                        <Grid item xs={12} mb={1} mt={1}>
                            <FormControl sx={{ width: '100%' }} size="small">
                                <InputLabel id="demo-simple-select-label">Перевозчики</InputLabel>
                                <Select
                                    className="select_field_edit_page"
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Перевозчики"
                                    {...register('carrier', { required: true })}
                                >
                                    {carriers && carriers.map((carrier) => (
                                        <MenuItem value={carrier.id}
                                            onClick={()=> {
                                                setRate(carrier.carrier_rate)
                                                setCurrency(carrier.carrier_currency)
                                                }}
                                        >
                                            {carrier.company_name}, {carrier.contact_person}
                                        </MenuItem>
                                    ))}

                                </Select>
                            </FormControl>
                            <FormError error={errors?.carrier} />
                        </Grid>


                        <Grid item xs={12} md={6} pt={1} align='start'>
                            <TextField type="number" size='small'
                                fullWidth
                                label="Итого лучшая ставка"
                                placeholder="Итого лучшая ставка"
                                value={rate}
                                onChange={(e) => {setRate(e.target.value)}}
                            />

                        </Grid>

                        <Grid item xs={12} md={6} pt={1} align='end'>
                            <FormControl sx={{ width: '99%' }} size="small">
                                <InputLabel id="demo-simple-select-label">Валюта</InputLabel>
                                
                                        <Select 
                                            className="select_field_edit_page"
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label="Валюта"
                                            value={currency}
                                            onChange={(value) => {setCurrency(value.target.value)}}
                                        >
                                            <MenuItem value={'USD'}>USD</MenuItem>
                                            <MenuItem value={'EUR'}>EUR</MenuItem>
                                            <MenuItem value={'BYN'}>BYN</MenuItem>
                                            <MenuItem value={'RUB'}>RUB</MenuItem>
                                        </Select>
                                    
                            </FormControl>
                        </Grid>
                        

                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button type='submit' variant='outlined' color='success'>Взять в работу</Button>

                </DialogActions>
            </form>

        </Dialog>
    )
}

