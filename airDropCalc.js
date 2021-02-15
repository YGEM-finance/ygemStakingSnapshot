const { BncClient } = require("@binance-chain/javascript-sdk");
var Web3 = require('web3');

const axios = require("axios")

let ygemSnapshot = require('./YgemStakeSnapshot.json');
let bnbAddresses = require('./Ygem-airdrop-bnb.json');

const api = "https://dex.binance.org/" /// api string
let privKey = "PRIVATE_KEY" // privkey hexstring (keep this safe)
const bnbClient = new BncClient(api)
const httpClient = axios.create({ baseURL: api })

const coin = 'YGEM-8F6M';
let to = '' //'tbnb17x3krfgmaddferz3486x9dped4nfrj2d6sccs0'
let amount = 0;
async function main() {

  bnbClient.chooseNetwork("mainnet") // or this can be "mainnet"
  await bnbClient.setPrivateKey(privKey)
  await bnbClient.initChain();
  const addressFrom = bnbClient.getClientKeyAddress() // sender address string (e.g. bnb1...)
  console.log('--------------------');
  console.log(addressFrom);
  console.log('--------------------');
  const sequenceURL = `${api}api/v1/account/${addressFrom}/sequence`;

  let timeout = 1000 // 1s
  let totalAmount = 0;
  Object.keys(bnbAddresses).forEach( function (key) {

    let staker = ygemSnapshot.find(element => {
      return element.staker == key;
    });

    if (staker != undefined) {
      to = bnbAddresses[key];
      amount = Web3.utils.fromWei(staker.amount.toString(), 'ether');

      totalAmount += parseFloat(amount);
      console.log(to);
      console.log(amount);
      setTimeout(async (to, amount) => {      
        console.log(to);
        console.log(amount);
        httpClient
          .get(sequenceURL)
          .then((res) => {
            const sequence = res.data.sequence || 0
            return bnbClient.transfer(
              addressFrom,
              to,
              amount,
              coin,
              'hello from YGEM on binance chain',
              sequence
            )
          })
          .then((result) => {
            console.log(result)
            if (result.status === 200) {
              console.log("success", result.result[0].hash)
            } else {
              console.error("error", result)
            }
          })
          .catch((error) => {
            console.error("error", error)
          })
        
      }, timeout, to, amount);
      
      timeout += 5000;
     
    }
  });

  console.log(totalAmount);

}

main();






