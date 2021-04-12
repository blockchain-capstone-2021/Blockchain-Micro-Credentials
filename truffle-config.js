const path = require('path');
const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = "elite pill excuse win amazing page lady observe trap ring sad power";

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
          mnemonic, 
          "https://sandbox.truffleteams.com/c0be1a1a-eda2-4119-b48c-27ecc1ffc269",
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