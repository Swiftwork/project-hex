var io = require('socket.io')();
var p2p = require('socket.io-p2p-server').Server;
io.use(p2p);

io.on('connection', function (socket) {
  socket.on('message', function (data) {
    socket.emit('message', data);
  })
});

io.listen(3000);