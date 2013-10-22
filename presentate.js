
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
        //console.log('Unrecognized sequence:', key);
        break;
    }
  });
};

module.exports = presentate

if (require.main === module) {
  var path = require('path');

  var slides = require(path.resolve(process.cwd(), 'pslides')).map(function(s){
    if (typeof s === 'function') return s().toString();
    else return s.toString();
  });

  presentate(slides, process.stdin, process.stdout);
}
