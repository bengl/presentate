var net = require('net'),
    stream = require('stream');

var presentate = require('./presentate');

function telnet(options, cb){ 
  var display = new stream.PassThrough();
  display.pipe(process.stdout);

  display.rows = process.stdout.rows;
  display.columns = process.stdout.columns;
  process.stdout.on('resize', function(){
    display.rows = process.stdout.rows;
    display.columns = process.stdout.columns;
    display.emit('resize');
  });

  var clients = [];

  var presentation = require('./presentate')(options, process.stdin, display, cb);

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
  }).listen(options.telnet);

  return presentation;
}

function notes(presentation, port, cb){
  var display = new stream.PassThrough();

  var clients = [];

  var notesPresentation = require('./presentate')({
    slides: presentation.notes,
    top:0,
    left:0
  }, process.stdin, display, cb);

  net.createServer(function(socket){
    socket.on('error', function(err){
      if (err.code === 'ECONNRESET') return; // Dont' care about this.
      throw err; // If it isn't this, it's a big deal.
    });
    socket.write("[2J[1;1H");
    socket.write(notesPresentation.slides[notesPresentation.currentSlide]);
    clients.push(socket);

    display.pipe(socket);

    socket.on('end', function () {
      display.unpipe(socket);
      clients.splice(clients.indexOf(socket), 1);
    });
  }).listen(port)
}

module.exports = telnet;

module.exports.notes = notes;
