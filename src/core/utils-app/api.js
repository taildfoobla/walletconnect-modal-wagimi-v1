import axios from "axios"
import {getLocalStorage, LOCALSTORAGE_KEY} from "./storage"
import COMMON_CONFIGS from "../configs-app"

const {API_URL} = COMMON_CONFIGS

export const createApiRequest = async ({url, method, data, params}) => {
    try {
        const {data: resp} = await axios({
            method,
            url: `${API_URL}${url}`,
            data,
            params,
        })

        return {
            success: true,
            data: resp,
        }
    } catch (e) {
        const {response} = e
        const message = response ? response.statusText : e.message || e
        const data = response ? response.data : ""
        return {
            success: false,
            message,
            data,
        }
    }
}

export const createAuthApiRequest = async ({url, method, data, params, isFormData, baseUrl = API_URL}) => {
    try {
        const headers = {}
        const token = getLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN)

        if (isFormData) {
            headers["Content-Type"] = "multipart/form-data"
        }
        headers["Authorization"] = `Bearer ${token}`
        const {data: resp} = await axios({
            method,
            url: `${baseUrl}${url}`,
            data,
            params,
            headers,
        })

        return {
            success: true,
            data: resp,
        }
    } catch (e) {
        const {response} = e
        // console.log(e)
        const errorMessage = response ? response.statusText : e.message || e
        if (response && response.status && [401, 403].includes(response.status)) {
            // removeStorageAfterLogout()
            // if (props) {
            //     // console.log(props.location)
            //     // console.log(props.location.search)
            //     setSessionStorage(SESSION_KEY.REDIRECT_URL, props.location.pathname + props.location.search)
            // }
            // window.location.href = Paths.Login
        }
        if (response && response.status && [404].includes(response.status)) {
            // return autoRedirect ? window.location.href = Paths.NotFound : null
        }

        return response
            ? {
                  success: false,
                  status: response.status,
                  errorMessage,
                  data: response.data,
              }
            : {
                  success: false,
                  errorMessage,
              }
    }
}

export const loginByWallet = async (data) => {
    try {
        const {data: resp} = await axios({
            method: "POST",
            url: `${API_URL}/auth/login-by-wallet`,
            data,
        })

        if (resp.success && resp.data && resp.data.access_token) {
            localStorage.setItem("walletToken", resp.data.access_token)

            clearTimeout(window._loginByWallet)
            window._loginByWallet = setTimeout(async () => {
                await loginByWallet(data)
            }, 5 * 60 * 1000)
        }

        return resp
    } catch (e) {
        const {response} = e
        const message = response ? response.statusText : e.message || e
        const data = response ? response.data : ""
        return {
            success: false,
            message,
            data,
        }
    }
}

export const depositNFTToApp = async (data) => {
    const authen = `Bearer ${localStorage.getItem("ACCESS_TOKEN")}`
    try {
        const {data: resp} = await axios({
            method: "POST",
            url: `${API_URL}/wallet/deposit-transaction-by-web`,
            // headers: {
            //     Authorization: authen
            // },
            data,
        })

        return resp
    } catch (e) {
        const {response} = e
        const message = response ? response.statusText : e.message || e
        const data = response ? response.data : ""
        return {
            success: false,
            message,
            data,
        }
    }
}

export const getMoonBeatInfo = async (tokenIds) => {
    try {
        const {data: resp} = await axios({
            method: "GET",
            url: `${API_URL}/wallet/moon-beasts?token_ids=${tokenIds.join(",")}`,
            // headers: {
            //     Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`
            // },
        })

        return resp
    } catch (e) {
        const {response} = e
        const message = response ? response.statusText : e.message || e
        const data = response ? response.data : ""

        return {
            success: false,
            message,
            data,
        }
    }
}

export const updateTransactionHash = async ([data]) => {
    try {
        const {data: resp} = await axios({
            method: "POST",
            url: `${API_URL}/wallet/update-wallet-transaction-by-web`,
            // headers: {
            //     Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`
            // },
            data,
        })

        return resp
    } catch (e) {
        const {response} = e
        const message = response ? response.statusText : e.message || e
        const data = response ? response.data : ""
        return {
            success: false,
            message,
            data,
        }
    }
}

export const checkTransactionHash = async ([data]) => {
    
    try {
        const {data: resp} = await axios({
            method: "GET",
            url: `${API_URL}/web-event/advent-event/check-result-reward-onchain?user_event_id=${data.user_event_id}&type_reward=${data.typeClaim}`,
            // headers: {
            //     Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`
            // },
            data,
        })

        return resp
    } catch (e) {
        const {response} = e
        const message = response ? response.statusText : e.message || e
        const data = response ? response.data : ""
        return {
            success: false,
            message,
            data,
        }
    }
}
