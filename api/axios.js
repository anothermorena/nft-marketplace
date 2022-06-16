import axios from 'axios';

//set the url for the entire application
const BASE_URL = 'https://b049-41-138-76-113.eu.ngrok.io';

export default axios.create({
    baseURL: BASE_URL
});