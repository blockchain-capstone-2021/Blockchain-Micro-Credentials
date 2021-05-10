import axios from 'axios'


// Utility file for making API calls

const microcredapi = axios.create({
    baseURL: 'http://localhost:3001'
})

export default microcredapi;