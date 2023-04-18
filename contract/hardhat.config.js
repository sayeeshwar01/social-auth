require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

module.exports = {
defaultNetwork: "polygon_mumbai",
networks: {
hardhat: {
},
polygon_mumbai: {
url: "https://rpc-mumbai.maticvigil.com",
accounts: ["7ad8f4c8613150c245881e1eb37971bde75dedd2675e46cb3bd5e8d350466277"]
}
},
etherscan: {
apiKey: "9A7BU1C1I3JZTVINHMYJHPBBBWU4Y8E689"
},
solidity: {
version: "0.8.9",
settings: {
optimizer: {
enabled: true,
runs: 200
}
}
},
}