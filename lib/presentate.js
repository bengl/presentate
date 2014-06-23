var keypress = require('keypress');
var prepareSlides = require('./prepareSlides');

module.exports = function presentate(slides, top, left, stdin, stdout, cb){
  cb = typeof cb === 'function' ? cb : null;

  var presentation = {};

  var write = function(x){stdout.write(x)};

  keypress(stdin);

  function showSlide(n, prev){
    presentation.currentSlide = n;
    var thisSlide = presentation.slides[n];
    var prevSlide = presentation.slides[prev];
    write("[2J[1;1H"); // clear screen and return to top left
    write(thisSlide);
    write('\n');
  }

  // flatten and color
  presentation.slides = prepareSlides(slides, top, left);

  stdin.setRawMode(true);
  write("[?25l"); //hide cursor
  showSlide(0); // show the first slide

  stdin.on('keypress', function(chunk, key){
    var currentSlide = presentation.currentSlide;
    if (!key) return; // errors otherwise
    switch (key.name) {
      case 'left':
        if (currentSlide > 0)
          showSlide(currentSlide - 1, currentSlide);
        break;
      case 'right':
      case 'space':
        if (currentSlide < presentation.slides.length - 1)
          showSlide(currentSlide + 1, currentSlide);
        break;
      case 'escape':
      case 'q':
        quit(write, cb);
        break;
      case 'c':
        if (key.ctrl) quit(write, cb);
        break;
    }
  });

  return presentation;
};

function quit(write, cb) {
  write("[0m[?25h"); //show cursor, reset colors, etc.
  write('\n\n');
  if (typeof cb === 'function') {
    cb();
  } else {
    process.exit(0);
  }
}

