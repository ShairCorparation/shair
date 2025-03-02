import { Box, Grid, BottomNavigation, BottomNavigationAction, CircularProgress } from '@mui/material'
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
import { useState, useEffect } from 'react'
import { api } from '../../api/api';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png'
import './main-page.css'


export default function MainPage() {
    const [alertInfo, setAlertInfo] = useState({ open: false, color: '', message: '' });
    const { pathname } = useLocation()
    
    const navigate = useNavigate()
    const [user, set_user] = useState()
    const [loader, setLoader] = useState(true)


    useEffect(() => {
        const get_current_user = async () => {
            await api('/auth/users_info/current_user/').then((res) => {
                set_user(res.data)
                setLoader(false)
            }).catch(err => {})
        }
        get_current_user() 
    }, [])

    return (
        loader ?
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh !important' }}>
                <CircularProgress />
            </Box>
            :
            <Grid container>
                
                <Box sx={{ width: '-webkit-fill-available' }} >
                    <BottomNavigation
                        className='box_panel_navigation'
                        showLabels
                        value={pathname}
                        onChange={(event, newValue) => {
                            navigate(`${newValue}`)
                        }}
                    >
                        <img src={logo} alt="logo" width={'inherit'} style={{marginRight: '30px'}}/>

                        <BottomNavigationAction label="Запросы" className={pathname==='/requests' ? 'active_requests' : 'requests'} 
                            value='/requests' icon={<ForumRoundedIcon />} />

                        <BottomNavigationAction label="Заказы" className={pathname==='/orders' ? 'active_orders' : 'orders'}
                            value='/orders' icon={<AssignmentRoundedIcon />} />

                        <BottomNavigationAction label="Клиенты" className={pathname==='/clients' ? 'active_clients' : 'clients'}
                            value='/clients' icon={<HandshakeRoundedIcon />} />

                        <BottomNavigationAction label="Перевозчики" className={pathname==='/carriers' ? 'active_carriers' : 'carriers'}
                            value='/carriers' icon={<LocalShippingRoundedIcon />} />
                        {user?.is_staff && 
                            <BottomNavigationAction label="Отчеты" className={pathname==='/reports' ? 'active_reports' : 'reports'}
                                value='/reports' icon={<ArticleRoundedIcon />} />
                        }

                        <BottomNavigationAction label="Архив" className={pathname==='/archive' ? 'active_archive' : 'archive'}
                            value='/archive' icon={<ImportContactsIcon />} />
                        
                        <BottomNavigationAction label="Профиль" className={pathname==='/profile' ? 'active_profile' : 'profile'}
                            value='/profile' icon={<AccountCircleIcon />} />

                    </BottomNavigation>
                </Box>
                <Grid container item xs={12} p={1} className='main_container'>

                    {pathname === '/requests' && <Requests setAlertInfo={setAlertInfo}/>}
                    {pathname === '/orders' && <Orders />}
                    {pathname === '/clients' && <Clients />}
                    {pathname === '/carriers' && <Carriers />}
                    {pathname === '/reports' && <Reports /> }
                    {pathname === '/archive' && <Archive /> }
                    {pathname === '/profile' && <Profile /> }
                </Grid>
                <ErrorMessage alertInfo={alertInfo} setAlertInfo={setAlertInfo} />
            </Grid>
    )
}