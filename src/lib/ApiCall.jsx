import axios from "axios"
import { API_URL, REFRESH } from "@/utils/Urls"
import { ForceLogOut } from "@/utils/Logout"

const API = axios.create({
    baseURL: API_URL,
    withCredentials: true
})

const refresh = async () => {
    try {
        const response = await API.post(REFRESH)
        if (response.data.Status === 'Success' && response.status === 200) {
            return true
        }
    } catch (error) {
        ForceLogOut();
    }
}

export async function GetApi(url) {
    try {
        const response = await API.get(url)
        return { data: response.data, status: response?.status, error: null }
    } catch (error) {
        if (error?.response?.status == 401 && error?.response?.data.Message === 'Invalid or Expired Token') {
            const isTokenRefreshed = await refresh()
            if (isTokenRefreshed) {
                const response = await API.get(url)
                return { data: response.data, status: response?.status, error: null }
            }
        } else {
            return { data: null, status: error?.response?.status, error: error }
        }
    }
}

export async function PostApi(url, body = {}) {
    try {
        const response = await API.post(url, body)
        return { data: response.data, status: response.status, error: null }
    } catch (error) {
        if (error?.response?.status == 401 && error?.response?.data.Message === 'Invalid or Expired Token') {
            const isTokenRefreshed = await refresh()
            if (isTokenRefreshed) {
                const response = await API.post(url, body)
                return { data: response.data, status: response?.status, error: null }
            }
        } else {
            return { data: null, status: error?.response?.status, error: error }
        }
    }
}
