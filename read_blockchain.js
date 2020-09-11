const Blockchain = require('./Blockchain');
const fs = require('fs');

module.exports = () => {
  const blockchainObj = fs.readFileSync('blockchain.json');
  const blockchain = new Blockchain();
  blockchain.load_chain(JSON.parse(blockchainObj));

  return blockchain;
};
