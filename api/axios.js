//1. import the required packages and modules
//======================================
import axios from 'axios';

//2. set the url for the entire application
//======================================
const BASE_URL = 'https://6e9e-105-235-240-14.ngrok.io';

export default axios.create({
    baseURL: BASE_URL
});