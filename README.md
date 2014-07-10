# Presentate

**Presentate** is a terminal presentation tool. It enables you to create presentations that are as beautiful as your terminal can be. If web browsers can be in the terminal, why can't presentations?

## Installation

`(sudo) npm i -g presentate`

## Basic usage

```
  Usage: presentate [options]

  Options:

    -h, --help            output usage information
    -V, --version         output the version number
    -T --telnet [port]    telnet viewer port number
    -t --top [num]        lines of padding from the top (default: 1)
    -l --left [num]       columns of padding from the left (default: 3)
    -c --center [WxH]     center in the terminal, with width w and height H
    -f --file [filename]  a slides.js file (default: ./slides.presentate)
    -A --all              show all the slides at once, delimited by "\n---\n"
    -N --notes [port]     telnet notes port number
    -s --sizing_slide     insert a sizing slide at the beginning
    -H --html             generate HTML version of "--all" (add your own CSS)
```

Create a file called `slides.presentate`. Format it as you would any other text file. Separate the slides with a line consisting only of `---`. You can make a (almost) cool reveal effect by inserting `{pause}` where you want to stop rendering the slide. See the thirst slide in the included `slides.presentate` for details.

You can default values for any of the CLI options above by putting something like this at the top of your file:

```
{"top": 1, "left": 3}
===
```

That first line must be well-formatted JSON, and the second line must be exactly `===` on its own line. These values are overridden by command-line options.

You can use tags from [colors-templ](https://github.com/rvagg/colors-tmpl) to add some ANSI color codes, etc., to your presentation. Raw codes are also supported.

Syntax highlighting for code blocks is supported (but is currently not very good, sorry!). Surround your code with `{code:ext}` and `{/code}`, with a language file-extenstion instead of `ext`.

You can add slide notes (for use with the `-N` or `--notes` options) by putting `&&&` on its own line. Everything after that, for each slide, will be the slide's notes. If you specificy a telnet notes port, you can telnet to that port during a presentation to see the notes for the current slide.

You can open up your presentation by doing:

```
$ presentate
```

And then you can quit your presentation by pressing Q or ESC.

## Advanced usage

If you include presentate in your node application, you can require it. The exported object is a function, so you can call it like this:

```javascript
require('presentate')(options, inputStream, outputStream, cb);
```

Where `options.slides` is a string that looks like a `.presentate` file, amd the rest of the `options` object's properties are equivalent to the longer-form command-line parameters. You can use `process.stdin` and `process.stdout` for the default behavior. The presentation starts when you call the `presentate` function, and calls `cb` when the presentation finishes (by pressing Q or ESC in the presentation);
 
## TODO

* PDF output
* Slide templates.
* Basic effects.
* Interactive slides.
* Slideshow mode.
* Edit mode.

## License

See LICENSE file.
