var colorsTmpl = require('colors-tmpl'),
    highlight = require('consolehighlighter').highlight;

var codeRegex = /\{code:([a-z]+)\}(.|[^]*?)\{\/code\}/g;

module.exports = function prepareSlides(slides, top, left) {
  if (typeof slides === 'string')
    slides = slides.split(/\n---*\n/);

  // deal with progressive slides (in both supported ways)
  for (var i = 0; i < slides.length; i++) {
    if (Array.isArray(slides[i])) {
      progressive(slides[i]);
    } else if (slides[i].match(/\{pause\}/)) {
      slides[i] = slides[i].split(/\{pause\}/);
      progressive(slides[i]);
    }
  }

  return flatten(slides).map(function (string){
    var newString = string;
    newString = newString.replace(/\{raw\}(.*?)\{\/raw\}/g, function(m, r) {
      return '{raw}'+r.replace(/\{/g, "OPENBRACKET")+'{/raw}';
    });
    newString = colorsTmpl(newString).replace(/\\{/g, '{').replace(/\\}/g, '}');
    newString = newString.replace(/\{\/?raw\}/g,'').replace(/OPENBRACKET/g, '{');
    newString = newString.replace(codeRegex, function(m, extension, code){
      return highlight(code, extension);
    });
    newString = Array(top+1).join('\n') + Array(left+1).join(' ') +
                newString.replace(/\n/g, '\n'+Array(left+1).join(' '));
    return newString;
  });
}

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
