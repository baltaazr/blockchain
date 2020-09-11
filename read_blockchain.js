const Blockchain = require('./Blockchain');
const fs = require('fs');

module.exports = async () => {
  const blockchainObj = await fs.readFile('blockchain.json');
  const blockchain = new Blockchain();
  blockchain.load_chain(blockchainObj);
};
