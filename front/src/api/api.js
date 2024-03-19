import axios from 'axios'
import { Cookies } from 'react-cookie'


const cookie = new Cookies()

const URL = process.env.REACT_APP_API_DEV


export async function api(endpoint, method = 'GET', data, noAuth = false, { ...customConfig } = {}) {

    const csrftoken = cookie.get('csrftoken')
    const access_token = localStorage.getItem('access_token')

    const headers = 
        !noAuth
            ? {
                Authorization: `Bearer ${access_token}`,
                'X-CSRFToken': csrftoken,
                'Content-Type': 'application/json',
            }
            : {
                'X-CSRFToken': csrftoken,
                'Content-Type': 'application/json',
            }

    const config = {
        url: `${URL}${endpoint}`,
        method: method,
        ...customConfig,
        headers: {
            ...headers,
            ...customConfig.headers
        },
        data: data
    } 


    async function makeRequest(config) {
        try {
            const response = await axios(config)
            data = await response.data
            return {
                status: response.status,
                data
            }

        }
        catch (err) {

            if (err.response.status === 401) {

                try {
                    const res = await axios.post(`${URL}/auth/token/refresh/`,
                        { refresh: localStorage.getItem('refresh_token') })
            
                    localStorage.setItem('access_token', res.data.access)
                    localStorage.setItem('refresh_token', res.data.refresh)

                    config.headers = {
                        ...config.headers,
                        Authorization: `Bearer ${res.data.access}`,
                    }
                    return makeRequest(config)

                }
                catch (err) {
                    console.log(err)
                    removeStorageAndGoToLogin()
                }
            }
            return Promise.reject(err)
        }
    }
    return makeRequest(config)

}


export const removeStorageAndGoToLogin = () => {
    
    localStorage.clear()
  
    window.location.href = '/login/'
  }