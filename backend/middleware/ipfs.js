const IPFS = require('ipfs-mini')
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

//retrieve and return JSON or string data from IPFS using hash
async function ipfsGetData (hash) {
    return new Promise((resolve, reject) => {
        ipfs.catJSON(hash, (err, result) => {
            if (err) reject(new Error(err))
            resolve(result)
        })
    })
}
  
//store JSON or string on IPFS and return hash
async function ipfsStoreData (obj) {
    const CID = await new Promise((resolve, reject) => {
        ipfs.addJSON(obj, (err, result) => {
            if (err) reject(new Error(err))
            resolve(result)
        })
    })
    console.log('CID:', CID, '\n')
    return CID
}

module.exports = {
    ipfsStoreData,
    ipfsGetData
}