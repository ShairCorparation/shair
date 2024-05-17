import { Grid, FormControl, InputLabel, Select, MenuItem} from "@mui/material"
import { useEffect, useState } from "react"
import { api } from "../../../api/api"


export default function ExecutorFilter({ setExecutor, executor }) {
    const [executorList, setExecutorList] = useState([])

    const change_executor = (id) => {
        setExecutor(id)
    }

    useEffect(() => {
        api('/auth/users_info/').then((res) => {
            setExecutorList(res.data)
        })
    },[])

    return (
        <Grid item >
            <FormControl sx={{width: '250px'}} size="small">
                <InputLabel id="demo-simple-select-label">Исполнитель</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    defaultValue={executor}
                    label="Исполнитель"
                    onChange={(e) => change_executor(e.target.value)}
                >
                    <MenuItem value={0}>Сбросить фильтр</MenuItem>
                    {executorList.map(el => <MenuItem value={el.id}>{el.first_name} {el.last_name}</MenuItem>)}
                </Select>
            </FormControl>
        </Grid>
    )
}