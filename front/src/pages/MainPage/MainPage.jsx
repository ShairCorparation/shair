import { Box, Grid, BottomNavigation, BottomNavigationAction } from '@mui/material'
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import HandshakeRoundedIcon from '@mui/icons-material/HandshakeRounded';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import Requests from '../Requests/Requests';
import ErrorMessage from '../../components/ErrorMesage/ErrorMesage';
import Orders from '../Orders/Orders';
import Clients from '../Clients/Clients';
import Carriers from '../Carriers/Carriers';
import Reports from '../Reports/Reports';
import Profile from '../Profile/Profile';
import Archive from '../Archive/Archive';
import { useState } from 'react'
import './main-page.css'


export default function MainPage() {
    const [alertInfo, setAlertInfo] = useState({ open: false, color: '', message: '' });
    const [value, setValue] = useState('requests');

    return (
            <Grid container>
                <Box sx={{ width: '-webkit-fill-available' }} >
                    <BottomNavigation
                        className='box_panel_navigation'
                        showLabels
                        value={value}
                        onChange={(event, newValue) => {
                            setValue(newValue);
                        }}
                    >
                        <BottomNavigationAction label="Запросы" className={value==='requests' ? 'active_requests' : 'requests'} 
                            value='requests' icon={<ForumRoundedIcon />} />

                        <BottomNavigationAction label="Заказы" className={value==='orders' ? 'active_orders' : 'orders'}
                            value='orders' icon={<AssignmentRoundedIcon />} />

                        <BottomNavigationAction label="Клиенты" className={value==='clients' ? 'active_clients' : 'clients'}
                            value='clients' icon={<HandshakeRoundedIcon />} />

                        <BottomNavigationAction label="Перевозчики" className={value==='carriers' ? 'active_carriers' : 'carriers'}
                            value='carriers' icon={<LocalShippingRoundedIcon />} />

                        <BottomNavigationAction label="Отчеты" className={value==='reports' ? 'active_reports' : 'reports'}
                            value='reports' icon={<ArticleRoundedIcon />} />

                        <BottomNavigationAction label="Архив" className={value==='archive' ? 'active_archive' : 'archive'}
                            value='archive' icon={<ImportContactsIcon />} />
                        
                        <BottomNavigationAction label="Профиль" className={value==='profile' ? 'active_profile' : 'profile'}
                            value='profile' icon={<AccountCircleIcon />} />

                    </BottomNavigation>
                </Box>
                <Grid container item xs={12} p={1} className='main_container'>

                    {value === 'requests' && <Requests setAlertInfo={setAlertInfo}/>}
                    {value === 'orders' && <Orders />}
                    {value === 'clients' && <Clients />}
                    {value === 'carriers' && <Carriers />}
                    {value === 'reports' && <Reports /> }
                    {value === 'archive' && <Archive /> }
                    {value === 'profile' && <Profile /> }
                </Grid>
                <ErrorMessage alertInfo={alertInfo} setAlertInfo={setAlertInfo} />
            </Grid>
    )
}