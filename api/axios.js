import axios from 'axios';

//set the url for the entire application
const BASE_URL = 'https://b0ae-41-77-88-9.eu.ngrok.io';

export default axios.create({
    baseURL: BASE_URL
});