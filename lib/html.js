var prepareSlides = require('./prepareSlides');
var ansi = require('ansi-html-stream');
var stream = require('stream');
var util = require('util');

util.inherits(Formatter, stream.Transform);

function Formatter(opts) {
  stream.Transform.call(this, opts);
}

Formatter.prototype._transform = function _transform(chunk, encoding, done) {
  if (chunk.length === 0) return done();
  this.push('<pre class="presentate-slide">\n');
  this.push(chunk.toString('utf8')
      .replace(/\n---\n/g, '\n</pre>\n<pre class="presentate-slide">\n'));
  this.push('\n</pre>\n');
  done();
};

module.exports = function html(all) {
  var stream = ansi({chunked: true, classes: true});
  var formatter = new Formatter();
  stream.pipe(formatter).pipe(process.stdout);
  stream.end(all);
}

