//1. import the required packages and modules
//======================================
import axios from 'axios';

//2. set the url for the entire application
//======================================
const BASE_URL = 'https://7b1681.deta.dev/';

export default axios.create({
  baseURL: BASE_URL,
});
