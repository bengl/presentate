var net = require('net'),
    stream = require('stream');

var presentate = require('./presentate');

function telnet(slides, top, left, port, cb){ 
  var display = new stream.PassThrough();
  display.pipe(process.stdout);

  var clients = [];

  var presentation = presentate(slides, top, left, process.stdin, display, cb);

  net.createServer(function(socket){
    socket.on('error', function(err){
      if (err.code === 'ECONNRESET') return; // Dont' care about this.
      throw err; // If it isn't this, it's a big deal.
    });
    socket.write("[2J[1;1H");
    socket.write(presentation.slides[presentation.currentSlide]);
    clients.push(socket);

    display.pipe(socket);

    socket.on('end', function () {
      display.unpipe(socket);
      clients.splice(clients.indexOf(socket), 1);
    });
  }).listen(port);

  return presentation;
}

module.exports = telnet;
