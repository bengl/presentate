var colorsTmpl = require('colors-tmpl');

var demoColors = "red|yellow|green|blue|white|grey|cyan|rainbow|magenta|underline|bold|italic|inverse|zebra".split('|').map(function(c){
  return colorsTmpl("\n    {"+c+"}"+c+"{/"+c+"}");
});


var slides = [
'\n    {bold}{underline}Presentate{/underline}{/bold} allows you to make\n    command-line presentations using node.js',
'\n    Use left and right arrow keys to navigate.',
'\n    You can use {rainbow}colors.js{/rainbow} if you want.',
'\n    You can use {rainbow}colors.js{/rainbow} if you want.\n    It\'s not included, but I recommend it.',
'\n    You can use {rainbow}colors.js{/rainbow} if you want.\n    It\'s not included, but I recommend it.\n\n    For example...'
].map(function(s){return colorsTmpl(s)});

slides = slides.concat(demoColors);
slides.push("\n    https://github.com/bengl/presentate\n\n    Fork it! Use it!\n\n    -- @bengl");

module.exports = slides;
