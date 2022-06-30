import axios from 'axios';

//set the url for the entire application
const BASE_URL = 'https://ccf7-41-77-88-13.eu.ngrok.io';

export default axios.create({
    baseURL: BASE_URL
});