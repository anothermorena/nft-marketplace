import axios from 'axios';

//set the url for the entire application
const BASE_URL = 'https://0d56-105-235-242-5.eu.ngrok.io';

export default axios.create({
    baseURL: BASE_URL
});