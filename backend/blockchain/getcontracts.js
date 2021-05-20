// Tool to extract the contract addresses after a truffle migration has been run.

const fs = require('fs')
const filesToIgnore = ['IterableMapping.json', 'Migrations.json']

const files = fs.readdir('./build/contracts/', (err, files) => {
    if (err) {
        console.log(err);
    }

    const contracts = files;

    // removing the migration and iterrable mapping json

    filesToIgnore.forEach(ignoredFile => {
        const index = contracts.indexOf(ignoredFile)
        if (index >= 0) {
            contracts.splice(index, 1)
        }
    });

    async function getJSON(path, callback) {
        return callback(await fetch(path).then(r => r.json()));
    }

    console.log('\n--------------------------');
    console.log('CONTRACT ADDRESS VARIABLES');
    console.log('--------------------------\n');
    contracts.forEach(contract => {
        const rawData = fs.readFileSync(`./build/contracts/${contract}`)
        const data = JSON.parse(rawData);
        const contractName = data.contractName.toUpperCase() + '_ADDRESS'
        const contractAddress = data.networks['5777'].address
        const output = contractName + '=' + contractAddress // + '\n' uncomment this if you uncomment line 34 otherwise variables will be saved as a single string
        console.log(output);
        //fs.appendFileSync('.test', output) Spits out a file called '.test' in current directory
    });

})




