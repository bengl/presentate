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


function presentate(slides, stdin, stdout, b){

  var write = function(x){stdout.write(x)};
  var keypress = require('keypress');
  keypress(stdin);
  
  var currentSlide;
  
  function showSlide(n){
    currentSlide = n;
    write("[2J[1;1H"); // clear screen and return to top left
    write(slides[n]);
  }

  // deal with progressive slides
  for (var i = 0; i < slides.length; i++) {
    if (Array.isArray(slides[i])) progressive(slides[i]);
  }
  slides = flatten(slides);

  stdin.setRawMode(true);
  write("[?25l"); //hide cursor
  showSlide(0); // show the first slide

  stdin.on('keypress', function(chunk, key){
    switch (key.name) {
      case 'left':
        if (currentSlide > 0) showSlide(currentSlide - 1);
        break;
      case 'right':
      case 'space':
        if (currentSlide < slides.length - 1) showSlide(currentSlide + 1);
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

module.exports = presentate

if (require.main === module) {
  var path = require('path');

  var slides = require(path.resolve(process.cwd(), 'pslides')).map(function(s){
    if (typeof s === 'function') return s();
    else return s;
  });

  presentate(slides, process.stdin, process.stdout);
}
