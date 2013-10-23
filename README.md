# Presentate

**Presentate** is a terminal presentation tool. It enables you to create presentations that are as beautiful as your terminal can be. If web browsers can be in the terminal, why can't presentations?

## Basic usage

Create a file called `pslides.js`. This should be a node module that exports an array of "slides". A slide is just a string. Yep, that's it! Just a string. Unless it's an array. If it's an array, it'll be concatenated slide by slide for a cool progressive reveal effect (less cool than it sounds). See the provided `pslides.js` for details.

You can use tags from [colors-templ](https://github.com/rvagg/colors-tmpl) to add some ANSI color codes, etc., to your presentation.

Now, if you've installed presentate with `-g`, you can open up your presentation by doing:
```
$ presentate
``` 
And then you can quit your presentation by pressing Q or ESC.

## Advanced usage

If you include presentate in your node application, you can require it. The exported object is a function, so you can call it like this:
```
require('presentate')(slides, inputStream, outputStream, cb);
```
Where the `slides` are an array as above, `inputStream` is a readable stream and `outputStream` is a writable stream. You can use `process.stdin` and `process.stdout` for the default behavior, but you can get more creative if you want, and make, for example, telnet presentation servers. The presentation starts when you call the `presentate` function, and calls `cb` when the presentation finishes (by pressing Q or ESC in the presentation);
 
## TODO

* Top and left padding.
* Options/config. 
* Slide templates.
* Basic effects.
* Interactive slides.
* Slideshow mode.

## License

See LICENSE file.
