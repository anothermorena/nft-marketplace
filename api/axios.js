import axios from 'axios';

//set the url for the entire application
const BASE_URL = 'https://69b2-41-223-73-235.ngrok.io';

export default axios.create({
    baseURL: BASE_URL
});