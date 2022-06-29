import axios from 'axios';

//set the url for the entire application
const BASE_URL = 'https://10ff-105-235-242-3.eu.ngrok.io';

export default axios.create({
    baseURL: BASE_URL
});