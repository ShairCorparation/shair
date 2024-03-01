import * as React from 'react';
import {Card} from '@mui/material';
import './form_error.css'
import WarningIcon from '@mui/icons-material/Warning';


export default function FormError({error}){

    return (
        <React.Fragment>
            {error && <Card className="card_error">
                <WarningIcon sx={{color: '#bd9a68'}}/>
                <p>{error.message === '' ? "Пожалуйста заполните поле!" : error.message}</p>
            </Card>
            }

        </React.Fragment>
    )
}