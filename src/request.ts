import axios from 'axios'

const TOKEN = localStorage.getItem('TOKEN')
const instance = axios.create({
    baseURL: '/',
    headers: {'X-TOKEN': TOKEN }
})

instance.interceptors.response.use(response => {
    return response.data
})

export default instance
