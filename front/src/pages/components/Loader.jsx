import { Box, CircularProgress } from '@mui/material'

export default function Loader() {
    return (
        <Box sx={{ position: 'absolute', top: '50%', left: '50%' }}>
            <CircularProgress />
        </Box>
    )
}