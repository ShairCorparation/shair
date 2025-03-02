import axios from 'axios'
import { Cookies } from 'react-cookie'

const cookie = new Cookies()
const URL = process.env.REACT_APP_API_DEV

export async function api(endpoint, method = 'GET', data, noAuth = false, { ...customConfig } = {}) {

    function get_config() {
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
        return config
    }

    async function make_request() {
        try {
            let config = get_config()
            const response = await axios(config);
            return response;
        } catch (err) {
            console.log(err)
            if (err.response && err.response.status === 401) {
                try {
                    const refreshTokenResponse = await axios.post(`${URL}/auth/token/refresh/`, { refresh: localStorage.getItem('refresh_token') });
                    localStorage.setItem('access_token', refreshTokenResponse.data.access);
                    localStorage.setItem('refresh_token', refreshTokenResponse.data.refresh)

                    return make_request();
                } catch (error) {
                    removeStorageAndGoToLogin()
                }
            } 
        }
    }

    let result = await make_request()
    return result
}

export const removeStorageAndGoToLogin = () => {
    localStorage.clear()
    window.location.href = '/login/'
}