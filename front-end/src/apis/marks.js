import axios from 'axios'

const marks = axios.create({
    baseURL: 'http://localhost:3001/marks',
    headers: {"Access-Control-Allow-Origin": "*"}
});

export default marks;