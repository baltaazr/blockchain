const dgram = require('dgram');
const socket = dgram.createSocket('udp4');
const config = require('config');

socket.on('error', (err) => {
  console.log(`socket error:\n${err.stack}`);
  socket.close();
});

socket.on('message', (msg, rinfo) => {
  const message = 'transaction received';
  socket.setBroadcast(true);
  socket.send(
    message,
    0,
    message.length,
    config.get('transactionsPort'),
    '255.255.255.255'
  );
  console.log(JSON.parse(msg.toString()));
});

socket.on('listening', () => {
  const address = socket.address();
  console.log(`socket listening ${address.address}:${address.port}`);
});

socket.bind(config.get('minePort'));
