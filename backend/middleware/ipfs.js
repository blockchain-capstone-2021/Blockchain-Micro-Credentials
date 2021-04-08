const IPFSClient  = require('ipfs-http-client')
const ipfs = IPFSClient({
    host: 'ipfs.infura.io',
    port: '5001',
    protocol: 'https'
})

const storeData = async (arg) => {
    data = {name: arg.name, age: arg.age}
    const buffer = Buffer.from(JSON.stringify)
    const { path } = await ipfs.add(buffer);
    return path
}

const retrieveData = async (hash) => {
    data = {}
    for await (const file of ipfs.get(hash)) {  
        if (!file.content) continue;
        const content = []
        for await (const chunk of file.content) {
          content.push(chunk)
        }
        data = await JSON.parse(content[0].toString())
      }
      return data
}

module.exports = {
    storeData,
    retrieveData
}