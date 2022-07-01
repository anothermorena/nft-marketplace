import axios from 'axios';

//set the url for the entire application
const BASE_URL = 'https://1194-105-235-242-6.eu.ngrok.io';

export default axios.create({
    baseURL: BASE_URL
});