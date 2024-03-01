import * as React from 'react'
import { Grid, IconButton, TextField, Button } from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel';
import '../../Clients/filters/filter.css'

export default function FinesFilter({ setFilterData, filterData, setSendFilter, sendFilter, initial_data }) {
    return (
        <Grid container item xs={12} p={1}>
            <Grid container item xs={12} spacing={1} p={1}>
                <Grid item xs={2} md={1.2} lg={1.4} xl={1.1}>
                    <IconButton aria-label="delete" 
                        onClick={()=> {
                            setFilterData({...filterData, company_name_on_it: '', unp_on_it: ''})
                            setSendFilter(!sendFilter)
                            }}
                    >
                        <CancelIcon />
                    </IconButton>
                    ID:
                </Grid>

                <Grid item alignItems='center' className='input_container' justifyContent='center' p={1} ml={1}>
                    <span>Название компании: </span>
                    <TextField id="outlined-basic" variant="outlined" size='small'
                        value={filterData.company_name_on_it}
                        onChange={(e) => setFilterData({ ...filterData, company_name_on_it: e.target.value })}
                    />
                </Grid>

                <Grid item alignItems='center' className='input_container' justifyContent='center' p={1} ml={1}>
                    <span>УНП: </span>
                    <TextField id="outlined-basic" variant="outlined" size='small'
                        value={filterData.unp_on_it}
                        onChange={(e) => setFilterData({ ...filterData, unp_on_it: e.target.value })}
                    />
                </Grid>
               
            </Grid>

            <Grid container item xs={12} spacing={1} p={1} justifyContent='flex-end'>
                <Grid item>
                    <Button color='error' onClick={()=> {
                        setFilterData(initial_data)
                        setSendFilter(!sendFilter)
                        }}
                    >
                        Очистить фильтр
                    </Button>
                </Grid>

                <Grid item>
                    <Button color='success' onClick={() => setSendFilter(!sendFilter)}>Применить фильтры</Button>
                </Grid>
            </Grid>
        </Grid>
    )
}