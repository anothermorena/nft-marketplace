import axios from 'axios';

//set the url for the entire application
//======================================
const BASE_URL = 'https://6356-41-223-72-15.ngrok.io';

export default axios.create({
    baseURL: BASE_URL
});