//1. import the required packages and modules
//======================================
import axios from 'axios';

//2. set the url for the entire application
//======================================
const BASE_URL = 'https://fe13-41-223-73-190.ngrok.io';

export default axios.create({
    baseURL: BASE_URL
});