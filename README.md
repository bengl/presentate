# Presentate

**Presentate** is a terminal presentation tool. It enables you to create presentations that are as beautiful as your terminal can be. If web browsers can be in the terminal, why can't presentations?

## Basic usage

Create a file called `slides.presentate`. Format it as you would any other text file. Separate the slides with a line consisting only of `---`. You can make a (almost) cool reveal effect by inserting `{pause}` where you want to stop rendering the slide. See the thirst slide in the included `slides.presentate` for details.

You can set top and left padding for your presentation by adding a few lines at the top of your file like this:

```
{"top": 1, "left": 3}
===
```

That first line must be well-formatted JSON, and the second line must be exactly `===` on its own line. These values can be overridden by command-line options.

You can use tags from [colors-templ](https://github.com/rvagg/colors-tmpl) to add some ANSI color codes, etc., to your presentation. Raw codes are also supported.

Now, if you've installed presentate with `-g`, you can open up your presentation by doing:

```
$ presentate
```

And then you can quit your presentation by pressing Q or ESC.

Here are the command-line options:

```
  Usage: presentate [options]

  Options:

    -h, --help            output usage information
    -V, --version         output the version number
    -T --telnet [num]     telnet viewer port number (optional)
    -t --top [num]        lines of padding from the top (default: 1)
    -l --left [num]       columns of padding from the left (default: 3)
    -f --file [filename]  a slides.js file (default: ./pslides.js)
    -A --all              show all the slides at once, delimited by "\n---\n"
    -H --html             generate HTML version of "--all" (ass your own CSS)
```

## Advanced usage

If you include presentate in your node application, you can require it. The exported object is a function, so you can call it like this:

```javascript
require('presentate')(slides, top, left, inputStream, outputStream, cb);
```

Where `slides` is a string that looks like a `.presentate` file, `top` is lines of padding from the top, `left` is columns of padding from the left, `inputStream` is a readable stream and `outputStream` is a writable stream. You can use `process.stdin` and `process.stdout` for the default behavior. The presentation starts when you call the `presentate` function, and calls `cb` when the presentation finishes (by pressing Q or ESC in the presentation);
 
## TODO

* PDF output
* Slide templates.
* Basic effects.
* Interactive slides.
* Slideshow mode.
* Edit mode.

## License

See LICENSE file.
