const dgram = require('dgram');
const Block = require('../block');
const Blockchain = require('../blockchain')
const fs = require('fs')
const write_blockchain = require('../write_blockchain')

const socket = dgram.createSocket('udp4');

socket.on('listening', () => {
  const address = socket.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

socket.on('message', (msg, rinfo) => {
  const blockchainObj = await fs.readFile('blockchain.json')
  const blockchain = new Blockchain()
  blockchain.load_chain(blockchainObj)

  const block = new Block()
  block.load_block(JSON.parse(msg.toString()))

  blockchain.add_block(block);

  write_blockchain(blockchain)
});

socket.bind(41234);
