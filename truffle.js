
module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*" // Match any network id
    },
     ropsten:  {
     network_id: 3,
     host: "localhost",
     port:  8545,
     gas:   50000,
     gasPrice: 5000000000
},
     live:  {
     network_id: 1,
     host: "localhost",
     port:  8545,
     gas:   50000,
     gasPrice: 3000000000
}
  }
};
