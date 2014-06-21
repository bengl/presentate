var net = require('net'),
    stream = require('stream');

var presentate;

function telnet(slides, top, left, port){ 
  var display = new stream.PassThrough();
  display.pipe(process.stdout);

  var clients = [];

  net.createServer(function(socket){
    socket.on('error', function(err){
      if (err.code === 'ECONNRESET') return; // Dont' care about this.
      throw err; // If it isn't this, it's a big deal.
    });
    socket.write("[2J[1;1H");
    socket.write(presentate.slides[presentate.currentSlide]);
    clients.push(socket);

    display.pipe(socket);

    socket.on('end', function () {
      display.unpipe(socket);
      clients.splice(clients.indexOf(socket), 1);
    });
  }).listen(port);

  presentate(slides, top, left, process.stdin, display, process.exit);
}

module.exports = function(_presentate){
  presentate = _presentate;
  return telnet;
};
