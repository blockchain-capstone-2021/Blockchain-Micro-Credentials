//PARAM NOTES: 
// -- The JSON params are the build JSON files, 
//      ex: const moduleContract = require('../blockchain/build/contracts/QA.json');
// -- The addresses are available in the env file, so parse the respective ones
// -- hash is the IPFS hash of the respective data 
// -- key is the respective serialized key object 
// -- contract is the respective smart contract you want to add a hash to
// -- contract tracker is the respective tracker smart contract you want to add the index with key to

const path = require('path');
require('dotenv').config({
  path: path.join(__dirname, '../.env'),
  debug: process.env.DEBUG
})

const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");

var Tx = require('ethereumjs-tx');

const privateKey = process.env.GANACHE_PRIVATE_KEY;

const privateKeyBuffer = Buffer.from(privateKey, 'hex');

const provider = new HDWalletProvider(
    privateKey, 
    process.env.GANACHE_URL
);  

const web3 = new Web3(provider);

web3.eth.defaultAccount= process.env.GANACHE_DEFAULT_ACCOUNT;

async function addHashToContractWithTracker(contractJson, trackerContractJson, contractAddress, trackerContractAddress, hash, key)
{
    let contract = new web3.eth.Contract(contractJson.abi,  contractAddress);
    let trackerContract = new web3.eth.Contract(trackerContractJson.abi, trackerContractAddress);
    
    const preLength = await contract.methods.getLength().call();

    console.log("printing the array length before mod: "+preLength);

    await addHash(contract, trackerContract, contractAddress, trackerContractAddress, hash, key, getIndex);
}

async function addHashToContractWithOutTracker(contractJson, contractAddress, hash)
{
    let contract = new web3.eth.Contract(contractJson.abi,  contractAddress);

    const preLength = await contract.methods.getLength().call();

    console.log("printing the array length before mod: "+preLength);

    await addHashWithoutTracker(contract, contractAddress, hash, printLatestIndex);
}

//Returning a promise
//Below is an example of how to deal with the return promise:
//      var hash;
//      await getHashFromContract(moduleContract, moduleTrackerContract, moduleAddress, moduleTrackerAddress, key).then(function(result){
//          hash = result;
//      });
//      console.log(hash);
async function getHashFromContract(contractJson, trackerContractJson, contractAddress, trackerContractAddress, key)
{
    let contract = new web3.eth.Contract(contractJson.abi,  contractAddress);
    let trackerContract = new web3.eth.Contract(trackerContractJson.abi, trackerContractAddress);

    const index = await trackerContract.methods.returnIndex(key).call();

    console.log("printing the tracker returned index: "+index);

    var hash;

    await contract.methods.returnHash(index).call().then(function(result)
    {
        hash = result;
    });

    return hash;
}

async function addHashWithoutTracker(contract, contractAddress, hash, callback)
{
    const data = contract.methods.addHash(hash).encodeABI();

    web3.eth.getTransactionCount(web3.eth.defaultAccount, (err, txCount) => {
        const txObject = {
            nonce: web3.utils.toHex(txCount),
            gasLimit: web3.utils.toHex(1000000),
            gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
            to: contractAddress,
            data: data
        }

        const tx = new Tx(txObject)
        tx.sign(privateKeyBuffer);

        const serializedTx = tx.serialize()
        const raw = '0x' + serializedTx.toString('hex')

        web3.eth.sendSignedTransaction (raw, (err, txHash) => {
            console.log('error:', err, 'txHash:', txHash)
            callback(contract)
        })
    })
}

async function addHash(contract, trackerContract, contractAddress, trackerContractAddress, hash, key, callback)
{
    const data = contract.methods.addHash(hash).encodeABI();

    web3.eth.getTransactionCount(web3.eth.defaultAccount, (err, txCount) => {
        const txObject = {
            nonce: web3.utils.toHex(txCount),
            gasLimit: web3.utils.toHex(1000000),
            gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
            to: contractAddress,
            data: data
        }

        const tx = new Tx(txObject)
        tx.sign(privateKeyBuffer);

        const serializedTx = tx.serialize()
        const raw = '0x' + serializedTx.toString('hex')

        web3.eth.sendSignedTransaction (raw, (err, txHash) => {
            console.log('error:', err, 'txHash:', txHash)
            callback(contract, trackerContract, trackerContractAddress, key, addTracker)
        })
    })
}

async function getIndex (contract, trackerContract, trackerContractAddress, key, callback)
{
    const returnIndex = await contract.methods.getLastIndex().call();

    console.log("printing the array index: "+returnIndex);

    callback(returnIndex, contract, trackerContract, trackerContractAddress, key, printLatestIndex);
}

async function addTracker(returnIndex, contract, trackerContract, trackerContractAddress, key, callback)
{
    const trackerData = trackerContract.methods.addTracker(key, returnIndex).encodeABI();

    web3.eth.getTransactionCount(web3.eth.defaultAccount, (err, txCount) => {
        const txObject = {
            nonce: web3.utils.toHex(txCount),
            gasLimit: web3.utils.toHex(1000000),
            gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
            to: trackerContractAddress,
            data: trackerData
        }

        const tx = new Tx(txObject)
        tx.sign(privateKeyBuffer);

        const serializedTx = tx.serialize()
        const raw = '0x' + serializedTx.toString('hex')

        web3.eth.sendSignedTransaction (raw, (err, txHash) => {
            console.log('error:', err, 'txHash:', txHash)
             callback(contract)
        })
    })
}

async function printLatestIndex(contract)
{
    const postLength = await contract.methods.getLength().call();

    console.log("printing the array length after mod: "+postLength);
}

//Returning a promise
//Below is an example of how to deal with the return promise:
//      var exists    
//      await checkExists(moduleTrackerContract,moduleTrackerAddress,key).then(function(result){
//          exists = result;
//      });
//      console.log(exists);
async function checkExists(trackerContractJson, trackerContractAddress, key)
{
    let trackerContract = new web3.eth.Contract(trackerContractJson.abi, trackerContractAddress);

    const exists = await trackerContract.methods.checkExists(key).call();

    return exists;
}

module.exports = {
    addHashToContractWithTracker,
    addHashToContractWithOutTracker,
    getHashFromContract,
    checkExists
}