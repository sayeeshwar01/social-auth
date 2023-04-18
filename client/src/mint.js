import {ethers} from "ethers";
const connection = new ethers.providers.JsonRpcProvider(
    "https://polygon-mumbai.g.alchemy.com/v2/PlAhV3I3VgGoY9ePFrgI0omWCHfX-wqw"
  );

  
  const privateKey = '7ad8f4c8613150c245881e1eb37971bde75dedd2675e46cb3bd5e8d350466277';
  const contractAddress = "0x5DffC44DfFB10CA90D1455B81B1FC16eB36b4597";
  const abi = require('./contract-abi.json')

  export const mint = async(user, url) => {

    let wallet = new ethers.Wallet(privateKey, connection);

    const myContract = new ethers.Contract(
        contractAddress,
        abi,
        wallet
    );

    const contractWithWallet = myContract.connect(wallet);
    const txn = await contractWithWallet.mintNFT(
        user,
        url,
        {gasLimit: 1500000, gasPrice: connection.getGasPrice()}
    );
    const receipt = await txn.wait();
    return receipt;
  }