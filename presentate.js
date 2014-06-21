#!/usr/bin/env node

var colorsTmpl = require('colors-tmpl'),
    keypress = require('keypress');

var telnet = require('./lib/telnet')(presentate);

function progressive(arr) {
  for (var i = 0; i < arr.length; i++) {
    if (typeof arr[i] === 'function') arr[i] = arr[i]();
    if (i === 0) continue;
    arr[i] = arr[i-1] + '\n' + arr[i];
  }
}

function flatten(a) {
  var r = [];
  for (var i=0; i<a.length; i++) {
    if (Array.isArray(a[i])) 
      r = r.concat(a[i]);
    else
      r.push(a[i]);
  }
  return r;
}

function pad(slide, top, left) {
  return Array(top+1).join('\n') + Array(left+1).join(' ') +
    slide.replace(/\n/g, '\n'+Array(left+1).join(' '));
}

function colorify(string){
  var newString = string.replace(/\{raw\}(.*?)\{\/raw\}/g, function(m, r) {
    return '{raw}'+r.replace(/\{/g, "OPENBRACKET")+'{/raw}';
  });
  newString = colorsTmpl(newString);
  return newString.replace(/\{\/?raw\}/g,'').replace(/OPENBRACKET/g, '{');
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

function prepareSlides(slides, top, left) {
    // deal with progressive slides
  for (var i = 0; i < slides.length; i++) {
    if (Array.isArray(slides[i])) progressive(slides[i]);
    if (typeof slides[i] === 'function') slides[i] = slides[i]();
  }
  
  return flatten(slides).map(colorify).map(function(x){
    return pad(x, top, left);
  });
}

function presentate(slides, top, left, stdin, stdout, cb){
  cb = typeof cb === 'function' ? cb : null;

  var write = function(x){stdout.write(x)};

  keypress(stdin);

  function showSlide(n, prev){
    presentate.currentSlide = n;
    var thisSlide = presentate.slides[n];
    var prevSlide = presentate.slides[prev];
    write("[2J[1;1H"); // clear screen and return to top left
    write(thisSlide);
    write('\n');
  }

  // flatten and color
  presentate.slides = prepareSlides(slides, top, left);

  stdin.setRawMode(true);
  //console.log(presentate.slides.join('\n---------------\n'));
  write("[?25l"); //hide cursor
  showSlide(0); // show the first slide

  stdin.on('keypress', function(chunk, key){
    var currentSlide = presentate.currentSlide;
    if (!key) return; // errors otherwise
    switch (key.name) {
      case 'left':
        if (currentSlide > 0)
          showSlide(currentSlide - 1, currentSlide);
        break;
      case 'right':
      case 'space':
        if (currentSlide < presentate.slides.length - 1)
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
};

presentate.prepareSlides = prepareSlides;
presentate.telnet = telnet;
module.exports = presentate;

if (require.main === module) {

  var program = require('commander');
  program.version(require('./package').version)
    .usage('[options]')
    .option('-T --telnet [num]', 'telnet port number (optional)')
    .option('-t --top [num]', 'lines of padding from the top (default: 1)')
    .option('-l --left [num]', 'columns of padding from the left (default: 3)')
    .option('-f --file [filename]', 'a slides.js file (default: ./pslides.js)')
    .option('-A --all ', 'show all the slides at once, delimited by "\\n---\\n"')
    .parse(process.argv);
  var port, slideFileName = './pslides.js';
  var slides = require(program.file || slideFileName);
  var top = 1;
  var left = 3;
  if (slides.slides) {
    top = slides.top || top;
    left = slides.left || left;
    slides = slides.slides;
  }
  top = parseInt(program.top || top);
  left = parseInt(program.left || left);
  if (program.all) {
    console.log(prepareSlides(slides, top, left).join('\n---\n'));
  } else if (program.telnet) {
    telnet(slides, top, left, program.telnet); 
  } else {
    presentate(slides, top, left, process.stdin, process.stdout);
  }
}
