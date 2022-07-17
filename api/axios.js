//1. import the required packages and modules
//======================================
import axios from 'axios';

//2. set the url for the entire application
//======================================
const BASE_URL = 'https://e00a-41-223-75-76.ngrok.io';

export default axios.create({
    baseURL: BASE_URL
});