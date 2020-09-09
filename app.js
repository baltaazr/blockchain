const dgram = require('dgram');
const Block = require('./block');
const Blockchain = require('./blockchain');
const Transaction = require('./transaction');

const socket = dgram.createSocket('udp4');

const blockchain = new Blockchain();

blockchain.create_genesis_block();

blockchain.add_new_transaction(new Transaction('sender', 'receiver', 10));

blockchain.mine();

const message = 'hello';

socket.on('listening', () => {
  socket.setBroadcast(true);
  socket.send(message, 0, message.length, 41234, '255.255.255.255');
});

socket.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

socket.bind(41234);
