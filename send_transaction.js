const dgram = require('dgram');
const Transaction = require('./Transaction');
const socket = dgram.createSocket('udp4');
const config = require('config');

const address = '10.54.3.7';

socket.on('error', (err) => {
  console.log(`socket error:\n${err.stack}`);
  socket.close();
});

socket.on('message', (msg, rinfo) => {
  if (rinfo.address === address) return;
  console.log(`Your transaction has been read by ${rinfo.address}`);
  socket.close();
});

socket.on('listening', () => {
  const myArgs = process.argv.slice(2);
  if (!myArgs[0] || !myArgs[1] || isNaN(myArgs[1])) {
    console.log('Please enter valid inputs');
    socket.close();
    return;
  }
  const transaction = new Transaction(address, myArgs[0], +myArgs[1]);
  console.log(transaction.json);
  socket.setBroadcast(true);
  socket.send(transaction.json, config.get('minePort'), '255.255.255.255');
});

socket.bind(config.get('transactionsPort'));
