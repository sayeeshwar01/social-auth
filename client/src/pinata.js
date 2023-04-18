// require('dotenv').config();
import axios from 'axios';
const key = '39769455cfd06ad2d115';
const secret = 'bf601fbbc6858e5bc4886c4ebf9d7edb88d722120c61bb8970f8f7704bce610a';

export const pinJSONToIPFS = async(JSONBody) => {
    console.log('reached')
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    //making axios POST request to Pinata ⬇️
    
    return axios 
        .post(url, JSONBody, {
            headers: {
                pinata_api_key: key,
                pinata_secret_api_key: secret,
            }
        })
        .then(function (response) {
           return {
               success: true,
               pinataUrl: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
           };
        })
        .catch(function (error) {
            console.log(error)
            return {
                success: false,
                message: error.message,
            }

    });
};