//1. import the required packages and modules
//======================================
import axios from 'axios';

//2. set the url for the entire application
//======================================
const BASE_URL = 'https://another-nft-market-place.herokuapp.com/';

export default axios.create({
    baseURL: BASE_URL
});