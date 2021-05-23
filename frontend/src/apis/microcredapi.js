import axios from 'axios'

const microcredapi = axios.create({
    baseURL: 'http://localhost:3001'
})

export default microcredapi;