const HDWalletProvider = require("@truffle/hdwallet-provider");
const path = require("path");
const dotenv = require('dotenv');
dotenv.config({
  path: './backend/.env',
  debug: process.env.DEBUG
});

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_directory: path.join(__dirname, "/backend/blockchain/contracts"),
  contracts_build_directory: path.join(__dirname, "/backend/blockchain/build"),
  test_directory: path.join(__dirname, "/backend/blockchain/test"),
  migrations_directory: path.join(__dirname, "/backend/blockchain/migrations"),
  networks: {
    staging: {
      network_id: 1617247087085,
      provider: function() {
        return new HDWalletProvider(
          process.env.GANACHE_MNEMONIC, 
          process.env.GANACHE_URL,
          0,
          10,
          false
        );
      }
    }
  },
  compilers: {
    solc: {
      version: "0.8.3"
    }
  }
};