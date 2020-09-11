const dgram = require('dgram');
const socket = dgram.createSocket('udp4');
const config = require('config');
const read_blockchain = require('./read_blockchain');
const write_blockchain = require('./write_blockchain');

console.log(read_blockchain());

socket.on('error', (err) => {
  console.log(`socket error:\n${err.stack}`);
  socket.close();
});

socket.on('message', async (msg, rinfo) => {
  const blockchain = read_blockchain();
  if (blockchain.unconfirmed_transactions.length >= 5) return;
  const message = 'transaction received';
  socket.send(
    message,
    0,
    message.length,
    config.get('transactionsPort'),
    rinfo.address
  );
  blockchain.add_new_transaction(JSON.parse(msg.toString()));
  write_blockchain(blockchain);
  if (blockchain.unconfirmed_transactions.length >= 5) {
    console.log('mining');
    const new_block = blockchain.mine();
    console.log('finished mining');
    socket.setBroadcast(true);
    socket.send(
      JSON.stringify(new_block),
      config.get('blocksPort'),
      '255.255.255.255'
    );
    write_blockchain(blockchain);
  }
});

socket.on('listening', () => {
  const address = socket.address();
  console.log(`socket listening ${address.address}:${address.port}`);

  socket.setBroadcast(true);
});

socket.bind(config.get('minePort'));
