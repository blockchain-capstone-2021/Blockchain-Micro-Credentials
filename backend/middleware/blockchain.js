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
});

const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");

var Tx = require('ethereumjs-tx');

const privateKey = process.env.GANACHE_PRIVATE_KEY;

const privateKeyBuffer = Buffer.from(privateKey, 'hex');

var provider;
if (process.env.NODE_ENV == "production") {
    //Provider config for production
    provider = new HDWalletProvider(
        privateKey,
        process.env.GANACHE_URL
    );
}
else {
    //Provider config for local development
    provider = new HDWalletProvider(
        privateKey,
        "http://127.0.0.1:7545"
    );
}

const web3 = new Web3(provider);

//Setting the default account to the first account in the sandbox
web3.eth.defaultAccount = process.env.GANACHE_DEFAULT_ACCOUNT;

//Function called when you want to add a hash to an array with it's indexed being tracked
async function addHashToContractWithTracker(contractJson, trackerContractJson, contractAddress, trackerContractAddress, hash, key) {
    //Get the respective contracts
    let contract = new web3.eth.Contract(contractJson.abi, contractAddress);
    let trackerContract = new web3.eth.Contract(trackerContractJson.abi, trackerContractAddress);

    await addHash(contract, trackerContract, contractAddress, trackerContractAddress, hash, key, getIndex);
}

//Returning a promise
//Function called when you want the IPFS hash given a particular key.
async function getHashFromContract(contractJson, trackerContractJson, contractAddress, trackerContractAddress, key) {
    //Get the respective contracts
    let contract = new web3.eth.Contract(contractJson.abi, contractAddress);
    let trackerContract = new web3.eth.Contract(trackerContractJson.abi, trackerContractAddress);

    const index = await trackerContract.methods.returnIndex(key).call();

    var hash;

    await contract.methods.returnHash(index).call().then(function (result) {
        hash = result;
    });

    return hash;
}

//Returning a promise
//Function called when you want to get the hash by index. Needed for getting the QA pairs of a module
async function getHashWithIndex(contractJson, contractAddress, index) {
    //Get the respective contract
    let contract = new web3.eth.Contract(contractJson.abi, contractAddress);

    let hash;

    await contract.methods.returnHash(index).call().then(function (result) {
        hash = result;
    });

    return hash;
}

//Function to add a hash with it's index being tracked
async function addHash(contract, trackerContract, contractAddress, trackerContractAddress, hash, key, callback) {
    const data = contract.methods.addHash(hash).encodeABI();

    await web3.eth.getTransactionCount(web3.eth.defaultAccount, async (err, txCount) => {
        //Creating  the transaction object
        const txObject = {
            nonce: web3.utils.toHex(txCount),
            gasLimit: web3.utils.toHex(1000000),
            gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
            to: contractAddress,
            data: data
        };

        //Signing the transaction
        const tx = new Tx(txObject);
        tx.sign(privateKeyBuffer);

        const serializedTx = tx.serialize();
        const raw = '0x' + serializedTx.toString('hex');

        //Send the transaction to the blockchain
        await web3.eth.sendSignedTransaction(raw, async (err, txHash) => {
            console.log('Adding Hash to Array - Error:', err, 'TxHash:', txHash);
        });
    });
    await callback(contract, trackerContract, trackerContractAddress, key, addTracker);
}

//Function to get the latest index of the hash array in a given contract
async function getIndex(contract, trackerContract, trackerContractAddress, key, callback) {
    const returnIndex = await contract.methods.getLastIndex().call();

    await callback(returnIndex, trackerContract, trackerContractAddress, key);
}

//Returning a promise
//Function called when you want the tracked index of a hash given it's key.
async function getHashIndex(trackerContractJson, trackerContractAddress, key) {
    //Get the respective contract
    let trackerContract = new web3.eth.Contract(trackerContractJson.abi, trackerContractAddress);

    const index = await trackerContract.methods.returnIndex(key).call();

    return index;
}

//Function to add a tracker for a given index of a hash array in a given contract
async function addTracker(returnIndex, trackerContract, trackerContractAddress, key) {
    const trackerData = trackerContract.methods.addTracker(key, returnIndex).encodeABI();

    await web3.eth.getTransactionCount(web3.eth.defaultAccount, async (err, txCount) => {
        //Creating  the transaction object
        const txObject = {
            nonce: web3.utils.toHex(txCount),
            gasLimit: web3.utils.toHex(1000000),
            gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
            to: trackerContractAddress,
            data: trackerData
        };

        //Signing the transaction
        const tx = new Tx(txObject);
        tx.sign(privateKeyBuffer);

        const serializedTx = tx.serialize();
        const raw = '0x' + serializedTx.toString('hex');

        //Send the transaction to the blockchain
        await web3.eth.sendSignedTransaction(raw, async (err, txHash) => {
            console.log('Adding Tracker to Index - Error:', err, 'TxHash:', txHash);
        });
    });
}

//Returning a promise
//Function called when you want to check whether a given key exists.
async function checkExists(trackerContractJson, trackerContractAddress, key) {
    //Get the respective contract
    let trackerContract = new web3.eth.Contract(trackerContractJson.abi, trackerContractAddress);

    const exists = await trackerContract.methods.checkExists(key).call();

    return exists;
}

module.exports = {
    addHashToContractWithTracker,
    getHashFromContract,
    checkExists,
    getHashIndex,
    getHashWithIndex
};