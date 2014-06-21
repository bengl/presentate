var demoColors = "red|yellow|green|blue|white|grey|cyan|rainbow|magenta|underline|bold|italic|inverse|zebra".split('|').map(function(c){
  var chunk = "{"+c+"}"+c+"{/"+c+"}";
  return chunk+"\n\n\n     Source: {raw}"+chunk+"{/raw}";
});


var slides = [
  '{bold}{underline}Presentate{/underline}{/bold} allows you to make\ncommand-line presentations using node.js',
  'Use left and right arrow keys to navigate.',
  [
    'You can use {rainbow}colors.js{/rainbow} if you want.',
    'It\'s included, as {bold}colors-tmpl{/bold}.',
    '\nFor example...'
  ]
];

slides = slides.concat(demoColors);
slides.push("https://github.com/bengl/presentate\n\nFork it! Use it!\n\n        -- @bengl");

module.exports = slides;
