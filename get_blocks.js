const dgram = require('dgram');
const Block = require('./Block');
const config = require('config');
const read_blockchain = require('./read_blockchain');
const write_blockchain = require('./write_blockchain');

const socket = dgram.createSocket('udp4');

socket.on('error', (err) => {
  console.log(`socket error:\n${err.stack}`);
  socket.close();
});

socket.on('listening', () => {
  const address = socket.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

socket.on('message', (msg) => {
  const blockchain = read_blockchain();

  const block = new Block();
  block.load_block(JSON.parse(msg.toString()));

  blockchain.add_block(block);

  write_blockchain(blockchain);
});

socket.bind(config.get('blocksPort'));
