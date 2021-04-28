const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = "elite pill excuse win amazing page lady observe trap ring sad power";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_directory: "./backend/blockchain/contracts",
  contracts_build_directory: "./backend/blockchain/build/contracts",
  test_directory: "./backend/blockchain/test",
  migrations_directory: "./backend/blockchain/migrations",
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
    // development: {
    //   host: "127.0.0.1",
    //   port: 7545,
    //   network_id: "5777", // Match any network id
    //   from: '0x52fDDDbcB6DB3fE2ad580aC17D3386DB1D9C4DB4'
    // }
  },
  compilers: {
    solc: {
      version: "0.8.3"
    }
  }
};