const dgram = require('dgram');
const Transaction = require('./transaction');
const socket = dgram.createSocket('udp4');
const config = require('config');

const address = '10.54.3.7';

socket.on('error', (err) => {
  console.log(`socket error:\n${err.stack}`);
  socket.close();
});

socket.on('message', (rinfo) => {
  if (rinfo.address === address || !rinfo.address) return;
  console.log(`Your transaction has been read by ${rinfo.address}`);
  socket.close();
});

socket.on('listening', () => {
  const myArgs = process.argv.slice(2);
  const transaction = new Transaction(address, myArgs[0], myArgs[1]);
  const transactionJSON = transaction.json;
  socket.setBroadcast(true);
  socket.send(
    transactionJSON,
    0,
    transactionJSON.length,
    config.get('minePort'),
    '255.255.255.255'
  );
  console.log(myArgs);
});

socket.bind(config.get('transactionsPort'));
