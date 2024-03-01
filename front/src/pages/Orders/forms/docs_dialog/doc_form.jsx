import { Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from '@mui/material'
import { Dropzone } from "@dropzone-ui/react";
import DeleteIcon from '@mui/icons-material/Delete';
import FormError from '../../../../components/FormError/FormError';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { useForm } from 'react-hook-form'
import * as React from 'react'
import { api } from '../../../../api/api';
import './doc.css'


export default function DocForm({ doc_dialog, setDocDialog, curr_req, setAlertInfo }) {

    const { register, handleSubmit, reset, setValue, clearErrors, setError, formState: { errors } } = useForm({
        mode: 'onChange',
        defaultValues: { file: null }
    })

    const [docs, setDocs] = React.useState(null)
    const [loadFiles, setLoadFiles] = React.useState(true)

    const handleSave = (form_data) => {
        if (form_data.file === null) {
            setError('file', { type: 'custom', message: 'Это поле обязательное!' })
        }
        else {
            form_data.request = curr_req.id
            api(`/api/docs/`, 'POST', form_data, false, { headers: { 'Content-Type': 'multipart/form-data' } }).then((res) => {
                reset()
                setAlertInfo({ open: true, color: 'success', message: res.data.message })
                setLoadFiles(true)
            })
        }
    }

    const handleClose = () => {
        setDocDialog(false);
    };

    React.useEffect(() => {
        if (curr_req) {
            api(`/api/docs/`, 'GET', {}, false, { params: { "request_id": curr_req.id } }).then((res) => {
                setDocs(res.data)
                setLoadFiles(false)
            })
        }
    }, [curr_req, loadFiles])

    function handleDelete(file_id){
        api(`/api/docs/${file_id}/`, 'DELETE').then((res)=> {
            setAlertInfo({ open: true, color: 'success', message: 'Документ был успешно удален!' })
            setLoadFiles(true)
        })
    }

    function setDocValue(file) {
        if (file[0].type === 'application/pdf' || file[0].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            setValue('file', file[0].file)
            clearErrors('file')
        }
        else {
            setError('file', { type: 'custom', message: 'Только PDF или doc/docx!' })
        }

    }

    return (
        <React.Fragment>

            <Dialog
                className='doc_dialog'
                maxWidth={'800px'}
                open={doc_dialog}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Управление документами"}
                </DialogTitle>
                <form onSubmit={handleSubmit(handleSave)} >
                    <DialogContent >
                        <Grid container alignItems='baseline'>
                            <Grid container item xs={12} md={5} p={1}>
                                {docs?.map((doc) => (
                                    <Grid container item xs={12} p={0} alignItems='center'>
                                        <Grid item xs={6}>
                                            <a href={doc.file} target='blank'>{doc.name}</a>
                                        </Grid>

                                        <Grid item xs={6} align='end'>
                                            <IconButton aria-label="delete" size="middle">
                                                <DeleteIcon onClick={()=> handleDelete(doc.id)} color='error'/>
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                ))}

                            </Grid>

                            <Grid container item xs={12} md={7} p={1}>
                                <Grid item xs={12} mb={2} mt={2}>
                                    <TextField sx={{ width: '100%' }} size='small' className="text_field_profile"
                                        label="Название файла"
                                        placeholder="Название файла"
                                        {...register("name", { required: true })}
                                    />
                                    <FormError error={errors?.name}></FormError>
                                </Grid>
                                <Grid item xs={12}>
                                    <Dropzone header={false} footer={false}
                                        onChange={(file) => setDocValue(file)}
                                        label={<SaveAltIcon fontSize='xxx-large' />}
                                    />
                                    <FormError error={errors?.file}></FormError>
                                </Grid>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color='error'>Закрыть</Button>
                        <Button type='submit' color='success'>Загрузить документ</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </React.Fragment>
    )
}