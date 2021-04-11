const express = require('express')
const {storeData, retrieveData} = require('../middleware/ipfs')
var router = express.Router()

router.get('/get/', async function (req, res, next) {
    const {fileUrl} = req.query;
    const data = retrieveData(fileUrl)
    res.status(200).send({"data": data})
})

router.post('/', async function (req, res, next) {
    data = {name: req.body.name, age: req.body.age}
    const url = storeData(data);
    res.status(200).send({"url": url})
})

module.exports = router;