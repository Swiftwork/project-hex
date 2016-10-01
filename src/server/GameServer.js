var io = require('socket.io')();
var p2p = require('socket.io-p2p-server').Server;
io.use(p2p);

io.on('connection', function(socket) {
  socket.on('peer-msg', function(data) {
    console.log('Message from peer: %s', data);
    socket.emit('peer-msg', data);
  })
});

io.listen(3000);