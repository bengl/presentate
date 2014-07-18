var colorsTmpl = require('colors-tmpl'),
    highlight = require('consolehighlighter').highlight,
    cardinal = require('cardinal').highlight;

var codeRegex = /\{code:([a-z]+)\}(.|[^]*?)\{\/code\}/g;

module.exports = function prepareSlides(presentation, slides, top, left) {
  slides = Array.isArray(slides) ? slides : slides.split(/\n---+\n/);
  var notes = [];

  // deal with progressive slides (in both supported ways), and notes
  var thisSlide, split, slideNotes;
  for (var i = 0; i < slides.length; i++) {
    split = slides[i].split(/\n&&&+\n/);
    thisSlide = split[0];
    slideNotes = split[1];
    if (thisSlide.match(/\{pause\}/)) {
      thisSlide = thisSlide.split(/\{pause\}/);
      progressive(thisSlide, slideNotes);
      thisSlide.forEach(function(){
        notes.push(slideNotes || '');
      });
    } else {
      notes.push(slideNotes || '');
    }
    slideNotes = false;
    slides[i] = thisSlide;
  }

  if (presentation) presentation.notes = notes;

  return flatten(slides).map(parseSlide).map(padSlide(top, left));
}

function parseSlide(string){
  var newString = string;
  newString = newString.replace(/\{raw\}(.*?)\{\/raw\}/g, function(m, r) {
    return '{raw}'+r.replace(/\{/g, "OPENBRACKET")+'{/raw}';
  });
  newString = colorsTmpl(newString).replace(/\\{/g, '{').replace(/\\}/g, '}');
  newString = newString.replace(/\{\/?raw\}/g,'').replace(/OPENBRACKET/g, '{');
  newString = newString.replace(codeRegex, function(m, extension, code){
    if (extension === 'javascript' || extension === 'js') {
      return cardinal(code);
    }
    return highlight(code, extension);
  });
  return newString;
}

function padSlide(top, left) {
  var leftPad = Array(left+1).join(' '), topPad = Array(top+1).join('\n');
  return function(string) {
    return topPad + leftPad + string.replace(/\n/g, '\n' + leftPad);
  }
}

function progressive(arr) {
  for (var i = 1; i < arr.length; i++)
    arr[i] = arr[i-1] + arr[i];
  var lastSlideLines = arr[arr.length-1].split(/\n/);
  var totalLines = lastSlideLines.length;
  var longestLine = lastSlideLines.reduce(function(prev, curr){
    return Math.max(prev, curr.length);
  }, 0);
  for (var i = 0; i < arr.length-1; i++) {
    arr[i] += Array(totalLines - arr[i].split(/\n/).length +1).join('\n');
    arr[i] = arr[i].split(/\n/).map(function(line){
      return line + Array(longestLine - line.length + 1).join(' ');
    }).join('\n');
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
