var keypress = require('keypress');
var prepareSlides = require('./prepareSlides');

module.exports = function presentate(options, stdin, stdout, cb){
  var slides = options.slides,
      top = options.top,
      left = options.left,
      edit = options.edit,
      center = options.center;

  cb = typeof cb === 'function' ? cb : null;

  var presentation = {};

  var write = function(x){stdout.write(x)};

  function showSlide(n, prev){
    presentation.currentSlide = n;
    var thisSlide = presentation.slides[n];
    write("[2J[1;1H"); // clear screen and return to top left
    write(centerPadding(center, stdout, thisSlide));
    write('\n');
  }

  // flatten and color
  presentation.slides = prepareSlides(presentation, slides, top, left);

  // a sizind slide in inverse color at the start
  if (options.sizing_slide) {
    presentation.slides.unshift(sizingSlide(presentation.slides));
  }

  // set up presentation object
  presentation.top = top;
  presentation.left = left;

  write("[?25l"); //hide cursor
  showSlide(0); // show the first slide

  stdin.setRawMode(true);
  keypress(stdin);
  function keyPressListener(chunk, key){
    var currentSlide = presentation.currentSlide;
    if (!key) return; // errors otherwise
    switch (key.name) {
      case 'left':
        if (currentSlide > 0)
          showSlide(currentSlide - 1);
        break;
      case 'right':
      case 'space':
        if (currentSlide < presentation.slides.length - 1)
          showSlide(currentSlide + 1);
        break;
      case 'escape':
      case 'q':
        quit(write, cb);
        break;
      case 'c':
        if (key.ctrl) quit(write, cb);
        break;
    }
  }
  stdin.addListener('keypress', keyPressListener);

  stdout.on('resize', function(){
    showSlide(presentation.currentSlide);
  });

  if (options.notes) require('./telnet').notes(presentation, options.notes);

  return presentation;
};

function centerPadding(center, stdout, slide){
  if (!center)
    return slide;
  var auto = center === 'auto';
  if (typeof center !== 'string' || !(center.match(/[0-9]+x[0-9]+/) || auto))
    center = 'auto';

  var split = auto ? slideSize(slide) : center.split('x');
  var w = parseInt(split[0]);
  var h = parseInt(split[1]);
  var rows = stdout.rows, columns = stdout.columns;
  if (w > columns || h > rows)
    return (auto?'CONTENT':'CENTER DIMENSIONS')+" CAN'T BE >"+columns+'x'+rows;

  var topPad = Math.floor(rows/2) - Math.floor(h/2);
  var leftPad = Math.floor(columns/2) - Math.floor(w/2);

  return Array(topPad).join('\n') + Array(leftPad).join(' ') +
                   slide.replace(/\n/g, '\n'+Array(leftPad).join(' '));
}

var ansiRegex = /\u001b\[(?:[0-9]{1,3}(?:;[0-9]{1,3})*)?[m|K]/g;

function slideSize(slide){
  var lines = slide.split(/\n/), line;
  var columns = 0;
  for (var i = 0; i < lines.length; i++) {
    // by this point we have the ansi codes, so need to remove them to measure
    line = lines[i].replace(ansiRegex, '');
    if (line.length > columns) {
      columns = line.length;
    }
  }
  return [columns, lines.length];
}

function quit(write, cb) {
  write("[0m[?25h"); //show cursor, reset colors, etc.
  write('\n\n');
  if (typeof cb === 'function') {
    cb();
  } else {
    process.exit(0);
  }
}

function sizingSlide(slides){
  var maxH = 0, maxW = 0;
  slides.forEach(function(slide){
    var size = slideSize(slide);
    maxW = Math.max(size[0], maxW);
    maxH = Math.max(size[1], maxH);
  });
  var row = '[7m'+Array(maxW+1).join(' ')+'[0m';
  return Array(maxH+1).join(row+'\n');
}

