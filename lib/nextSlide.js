var net = require('net');

function nextSlide(presentation, port){
  this.clients = [];
  this.presentation = presentation;
  net.createServer(function(socket){
    socket.on('error', function(err){
      if (err.code === 'ECONNRESET') return; // Dont' care about this.
      throw err; // If it isn't this, it's a big deal.
    });
    socket.write("[2J[1;1H");
    socket.write(presentation.slides[presentation.currentSlide+1]);
    clients.push(socket);
    socket.on('end', function () {
      display.unpipe(socket);
      clients.splice(clients.indexOf(socket), 1);
    });
  }).listen(port);
  presentation.on('slide', function(){
    clients.forEach(function(socket){
      if (presentation.slides[presentation.currentSlide+1]) {
        socket.write("[2J[1;1H");
        socket.write(presentation.slides[presentation.currentSlide+1]);
      }
    });
  });
}

module.exports = nextSlide;
