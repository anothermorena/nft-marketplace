import axios from 'axios';

//set the url for the entire application
const BASE_URL = 'https://f87a-41-223-73-251.ngrok.io';

export default axios.create({
    baseURL: BASE_URL
});