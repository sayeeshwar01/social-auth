const fs = require('fs');
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
request = require("request"); 
express = require("express");
const sss = require('shamirs-secret-sharing')
const Web3 = require("web3");
const bodyParser = require("body-parser");
const cors = require('cors');
const axios = require('axios');
const pinataSDK = require('@pinata/sdk');
const pinata = new pinataSDK('39769455cfd06ad2d115', 'bf601fbbc6858e5bc4886c4ebf9d7edb88d722120c61bb8970f8f7704bce610a');

var app = express();
app.use(cors({origin: true}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

const SCOPES = ['https://www.googleapis.com/auth/drive'];
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

const key = '39769455cfd06ad2d115';
const secret = 'bf601fbbc6858e5bc4886c4ebf9d7edb88d722120c61bb8970f8f7704bce610a';

app.get('/', async function(req,res){
  res.status(200).send('Server running');
})

app.get('/authenticate', async function(req,ress){

      if (typeof web3 !== 'undefined') {
          var web3 = new Web3(web3.currentProvider);
        } else {
          var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
        }

    client = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });

    const drive = google.drive({ version: 'v3', auth : client});

    if (fs.existsSync('./message.txt')) {
      const sh = [];
      fs.readFile("message.txt", function(err, buf) {
          sh[0] = buf.toString();
          // console.log(buf.toString());
          // console.log('Recovered Address: ', web3.eth.accounts.privateKeyToAccount(buf.toString()).address)
        });
        
      const res = await drive.files.list({
          q: "name = 'phrase' and mimeType = 'text/plain'",
          fields: 'nextPageToken, files(id, name)',
          spaces: 'drive',
      })//file exists

      // console.log(res.data.files[0].id);

      const msg = await drive.files.get({
          fileId: res.data.files[0].id,
          alt: 'media',
      })

      sh[1] = msg.data.toString();

      // console.log('Share 1: ', sh[0]);
      // console.log('Share 2: ', sh[1]);

      const recovered = sss.combine(sh.slice(0, 2));
      // console.log('Private key is: ', recovered.toString());
      console.log('Welcome back!! ', web3.eth.accounts.privateKeyToAccount(recovered.toString()).address);
      ress.status(200).json(web3.eth.accounts.privateKeyToAccount(recovered.toString()).address);
    }

    else {
      account = web3.eth.accounts.create();

      // console.log({account});
      // console.log(`address: ${account.address}`);
      // console.log(`privateKey: ${account.privateKey}`);

      // console.log(`address: ${account.address}`)

      const secret = account.privateKey
      const shares = sss.split(secret, { shares: 3, threshold: 2 })
      // console.log('Share 0 is: ', shares[0].toString('hex'));
      // // const recovered = sss.combine(shares.slice(0, 2))

      // console.log('share 1: ',shares[0].toString('hex'));
      // console.log('share 2: ',shares[2].toString('hex'));

      // var temp = [];
      // temp[0] = shares[0].toString('hex');
      // temp[1] = shares[1].toString('hex');

      // const recovered = sss.combine(temp.slice(0, 2))

      // console.log('Recovered Address: ', web3.eth.accounts.privateKeyToAccount(recovered.toString()).address) // 'secret key'

      fs.writeFile('message.txt', shares[0].toString('hex'), function(err){
          if(err) throw err;
          console.log('Saved');
      })


      var fileMetadata = {
          name: 'phrase', // file name that will be saved in google drive
        };
      
        var media = {
          mimeType: 'text/plain',
          // body: fs.createReadStream('message.txt'),
          body: shares[1].toString('hex'), // Reading the file from our server
        };
      
      
        drive.files.create(
          {
            resource: fileMetadata,
            media: media,
          },
        );

        console.log(`Thank you for signing up!! :  ${account.address}`);
        ress.status(200).json(account.address);

    }
})

app.post('/upload', async function(req, res){
  // console.log(req.body.fileContents);
  // const metadata = JSON.stringify({
  //   name: 'File name',
  // });
  // const formData = new FormData();
  // formData.append('file', req.body.fileContents);
  // formData.append('pinataMetadata', metadata);
  // const options = JSON.stringify({
  //   cidVersion: 0,
  // })
  // formData.append('pinataOptions', options);

  // try{
  //   const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
  //     maxBodyLength: "Infinity",
  //     headers: {
  //       'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
  //       pinata_api_key: key,
  //       pinata_secret_api_key: secret,
  //     }
  //   });
  //   console.log(res.data);
  // } catch (error) {
  //   console.log(error);
  // }
})
app.listen(4000, () => console.log('Server Started'));
// authorize().then(listFiles).catch(console.error);
// authorize().catch(console.error);