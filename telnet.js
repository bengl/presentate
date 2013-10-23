var net = require('net'),
    presentate = require('./presentate'),
    stream = require('stream');

var display = new stream.PassThrough();
display.pipe(process.stdout);

var clients = [];
var slides = require('./pslides').map(function(s){
  return s+'\n\n\n\n\n\n\n\n';
});

net.createServer(function(socket){
  socket.write("[2J[1;1H");
  socket.write(presentate.slides[presentate.currentSlide]);
  clients.push(socket);

  display.pipe(socket);

  socket.on('end', function () {
    display.unpipe(socket);
    clients.splice(clients.indexOf(socket), 1);
  });
}).listen(9000);

presentate(slides, process.stdin, display, process.exit)

