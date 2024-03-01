import React, { useState } from 'react';
import { Box, Grid, BottomNavigation, BottomNavigationAction } from '@mui/material';
import Fines from './tabs/Fines';
import Consumption from './tabs/Consumption';
import Overcomes from './tabs/Overcomes';


export default function Reports() {
    const [value, setValue] = useState('fines')

    return (
        <Grid container>
            <Box sx={{ width: '-webkit-fill-available' }} >
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                    }}
                >
                    <BottomNavigationAction label="Долги" value='fines' />
                    <BottomNavigationAction label="Доходность" value='overcomes' />
                    <BottomNavigationAction label="Расходы" value='consumption' />
                </BottomNavigation>
            </Box>

            <Grid container item xs={12} p={1} className='main_container'>
                {value === 'fines' && <Fines /> }
                {value === 'overcomes' && <Overcomes /> }
                {value === 'consumption' && <Consumption /> }
            </Grid>
        </Grid>
    )
}