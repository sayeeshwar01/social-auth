import logo from './logo.svg';
import './App.css';
import {pinJSONToIPFS} from './pinata.js'
import {mint} from './mint.js'
import google from './google.png';
import {ethers} from "ethers";
import {useAccount} from "@web3modal/react";
import React, { useState } from 'react';
// const fs = require('fs');
import axios from 'axios';

const key = '39769455cfd06ad2d115';
const secret = 'bf601fbbc6858e5bc4886c4ebf9d7edb88d722120c61bb8970f8f7704bce610a';

const UploadDocument = () => {

  const [user, setUser] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContents, setFileContents] = useState('');
  const [url, setUrl] = useState('');
  const [txhash, setTxHash] = useState('');

  const handleClick = (event) => {
    fetch("http://localhost:4000/authenticate").then((response)=>response.json()).then((json)=>{
      console.log('Welcome: ', json)
      setUser(json)
    });
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async (event) => {

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const contents = event.target.result;
        setFileContents(contents);
      };
      reader.readAsText(selectedFile); // Use `readAsArrayBuffer` for binary data
    }

    // 
    const metadata = JSON.stringify({
      name: 'docc',
    });
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('pinataMetadata', metadata);
    const options = JSON.stringify({
      cidVersion: 0,
    })
    formData.append('pinataOptions', options);
  
    
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxBodyLength: "Infinity",
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          pinata_api_key: key,
          pinata_secret_api_key: secret,
        }
      });
      const url = 'https://gateway.pinata.cloud/ipfs/'+res.data.IpfsHash;
    

    const mdata = new Object();
    mdata.name = 'my-doc';
    mdata.image = url;
    mdata.description = 'sample';

    console.log("Image URL: ", url);

    const pinataResponse = await pinJSONToIPFS(mdata);
    if (!pinataResponse.success) {
        return {
            success: false,
            status: "😢 Something went wrong while uploading your tokenURI.",
        }
    } 
    const tokenURI = pinataResponse.pinataUrl;
    console.log(tokenURI)

    const mintResponse = await mint(user, tokenURI);
    console.log(mintResponse);
    setTxHash(mintResponse.transactionHash);
  }


  if(!user) {
    var condition = <div>
                    <button className="flex items-center justify-center px-4 py-2 bg-pink-200 hover:bg-pink-300 text-black rounded-lg shadow-lg" onClick={handleClick}>
                    <img src={google} className='mr-6'></img>
                    Sign-in with Google
                    </button>
                </div>
  }
  else { 
    condition =   <div>
                  <h1 className='font-semibold mt-6 text-red-600 text-xl font-quicksand'>Welcome: {user}</h1>
                  <div className="bg-white shadow-md rounded-lg px-8 py-6 mt-4">
                  <label htmlFor="fileInput" className="block text-gray-700 text-lg font-medium mb-3">
                  Choose file:
                  </label>
                  <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <div className="flex items-center">
                    {selectedFile ? (
                      <span className="flex-1 text-gray-700">{selectedFile.name}</span>
                    ) : (
                      <span className="flex-1 text-gray-500">No file selected</span>
                    )}
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
                      disabled={!selectedFile}
                      onClick={handleUpload}
                    >
                      Upload
                    </button>
                  </div>
                </div>
                </div>      
  }

  if(!txhash){
    var transaction = <div>
                  </div>
  }

  else{
   var transaction = <div>
                      <h1 className='font-semibold mt-6 text-red-600 text-xl font-quicksand'>Visit</h1><span className='text-blue-500 font-quicksand'>https://mumbai.polygonscan.com/tx/{txhash}</span> <h1 className='font-semibold text-red-600 text-xl font-quicksand'>to view your document on-chain</h1>
                    </div>
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 mt-2">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 font-quicksand">Upload your documents securely</h1>
        {condition}
        {transaction}
    </div>
  );
};

export default UploadDocument;
