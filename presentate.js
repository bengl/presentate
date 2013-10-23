#!/usr/bin/env node

var colorsTmpl = require('colors-tmpl');

function progressive(arr) {
  for (var i = 0; i < arr.length; i++) {
    if (typeof arr[i] === 'function') arr[i] = arr[i]();
    if (i === 0) continue;
    arr[i] = arr[i-1] + arr[i];
  }
}
function flatten(a) {
  var r = [];
  for(var i=0; i<a.length; i++){
    if(Array.isArray(a[i])){
      r = r.concat(a[i]);
    }else{
      r.push(a[i]);
    }
  }
  return r;
}
function colorify(string){
  var newString = string.replace(/\{raw\}(.*?)\{\/raw\}/g, function(m, r) {
    return '{raw}'+r.replace(/\{/g, "OPENBRACKET")+'{/raw}';
  });
  newString = colorsTmpl(newString);
  return newString.replace(/\{\/?raw\}/g,'').replace(/OPENBRACKET/g, '{');
}


function presentate(slides, stdin, stdout, b){

  var write = function(x){stdout.write(x)};
  var keypress = require('keypress');
  keypress(stdin);
  
  function showSlide(n, prev){
    presentate.currentSlide = n;
    var thisSlide = presentate.slides[n];
    var prevSlide = presentate.slides[prev];
    if (thisSlide.indexOf(prevSlide) !== 0) {
      write("[2J[1;1H"); // clear screen and return to top left
      write(thisSlide);
    } else {
      write(thisSlide.replace(prevSlide, ''));
    }
  }

  // deal with progressive slides
  for (var i = 0; i < slides.length; i++) {
    if (Array.isArray(slides[i])) progressive(slides[i]);
    if (typeof slides[i] === 'function') slides[i] = slides[i]();
  }

  // flatten and color
  presentate.slides = flatten(slides).map(colorify);
  //console.log(JSON.stringify(slides)); process.exit(0);

  stdin.setRawMode(true);
  write("[?25l"); //hide cursor
  showSlide(0); // show the first slide

  stdin.on('keypress', function(chunk, key){
    var currentSlide = presentate.currentSlide;
    switch (key.name) {
      case 'left':
        if (currentSlide > 0) showSlide(currentSlide - 1, currentSlide);
        break;
      case 'right':
      case 'space':
        if (currentSlide < presentate.slides.length - 1) showSlide(currentSlide + 1, currentSlide);
        break;
      case 'escape':
      case 'q':
        write("[0m[?25h"); //show cursor, reset colors, etc.
        if (typeof cb === 'function') {
          cb();
        } else {
          console.log('\n\n');
          process.exit(0);
        }
        break;
      default:
        break;
    }
  });
};

module.exports = presentate;

if (require.main === module) {
  var port, slideFileName = require('path').resolve(process.cwd(), 'pslides.js');
  for (var i = 2; i < process.argv.length; i++) {
    if (process.argv[i].match(/.*\.js$/))
      slideFileName = process.argv[i];
    if (!isNaN(parseInt(process.argv[i])))
      port = parseInt(process.argv[i]);
  }
  var slides = require(slideFileName.replace(/\.js$/, ''));
  if (port) {
    require('./telnet')(slides, port); 
  } else {
    presentate(slides, process.stdin, process.stdout);
  }
}
