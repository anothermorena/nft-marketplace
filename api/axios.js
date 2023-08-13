//1. import the required packages and modules
//======================================
import axios from 'axios';

//2. set the url for the entire application
//======================================
const BASE_URL = 'https://9849-41-74-49-109.ngrok-free.app';

export default axios.create({
  baseURL: BASE_URL,
});
