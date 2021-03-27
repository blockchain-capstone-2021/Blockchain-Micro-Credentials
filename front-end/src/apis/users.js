import axios from 'axios'

const users = axios.create({
    baseURL: 'http://localhost:3001',
    headers: {"Access-Control-Allow-Origin": "*"}
});

export default users;