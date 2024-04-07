import * as React from 'react'
import { Grid, IconButton, TextField, Button, FormControl, Select, MenuItem } from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel';
import '../../Clients/filters/filter.css'
import { api } from '../../../api/api';

export default function FinesFilter({ setFilterData, filterData, setSendFilter, sendFilter, initial_data, selector, setSelector }) {

    const [users, setUsers] = React.useState()

    React.useEffect(() => {
        api('/auth/users_info/').then((res) => {
            setUsers(res.data)

        })

    }, [])

    return (
        <Grid container item xs={12} p={1}>
            <Grid container item xs={12} spacing={1} p={1}>
                <Grid container item xs={12} spacing={1} p={1}>
                    <Grid item className='selector_container' xs={2} md={1.2} lg={1.6} xl={1.5}>
                        <span>Группировать: </span>
                    </Grid>

                    <Grid item>
                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                            <Select
                                id="demo-select-small"
                                value={selector}
                                onChange={(v) => setSelector(v.target.value)}
                            >
                                <MenuItem value={'client'}>по клиенту</MenuItem>
                                <MenuItem value={'manager'}>по менеджеру</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                </Grid>
                {selector === 'client' &&
                    <React.Fragment>
                        <Grid item xs={2} md={1.2} lg={1.4} xl={1.1}>
                            <IconButton aria-label="delete"
                                onClick={() => {
                                    setFilterData({ ...filterData, company_name_on_it: '', unp_on_it: '' })
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
                    </React.Fragment>
                }

                {selector === 'manager' &&
                    <Grid item xs={12}>
                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                            <Select
                                id="demo-select-small"
                                value={filterData.executor}
                                onChange={(e) => setFilterData({ ...filterData, executor: e.target.value })}
                            >
                                <MenuItem value={0}>Выберете менеджера</MenuItem>
                                {users?.map((user) => (
                                    <MenuItem value={user.id}>{user.first_name} {user.last_name}</MenuItem>
                                ))}
                                
                            </Select>
                        </FormControl>
                    </Grid>
                }
            </Grid>

            <Grid container item xs={12} spacing={1} p={1} justifyContent='flex-end'>
                <Grid item>
                    <Button color='error' onClick={() => {
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