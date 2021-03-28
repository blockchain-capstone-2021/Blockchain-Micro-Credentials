var express = require('express');
const IPFSClient = require('ipfs-http-client')
const ipfs = IPFSClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })
var router = express.Router();

/* GET home page. */
router.get('/get/', async function(req,res,next) {
  const {fileUrl} = req.query
  for await (const file of ipfs.get(fileUrl)) {  
    if (!file.content) continue;
    const content = []
    for await (const chunk of file.content) {
      content.push(chunk)
    }
    const data = await JSON.parse(content[0].toString())
    res.status(200).send({"data": data})
  }
});
router.post('/',  async function(req, res, next) {
  data = {name: req.body.name, age: req.body.age}
  const buffer = Buffer.from(JSON.stringify(data));
  const {path} = await ipfs.add(buffer)
  console.log(`EXPRESS MARK POST: ${path}`);
  res.status(200).send({"url": path})
});
module.exports = router;
