# metadoc-md

This [metadoc](https://github.com/author/metadoc) post-processor will convert the markdown of description attributes in a metadoc to  HTML.

**Before metadoc-md:**

![Input](https://github.com/author/metadoc-md/raw/master/input.png)

**After metadoc-md:**

![Output](https://github.com/author/metadoc-md/raw/master/output.png)

## Usage

This processor can be run standalone or as a part of a metadoc build process.

To run as a standalone CLI application, the utility must be installed globally:

`npm install -g @author.io/metadoc-md`

It can then be run as:

```sh
metadoc-md --source /path/to/metadoc/api.json
```

Alternatively, it can be run as part of a series of metadoc processors. In this scenario, the module should be saved as part o the `devDependencies`:

`npm install @author.io/metadoc-md --save-dev`

It can then be used as a part of the metadoc generation process:

```sh
metadoc --source ./src --output ./docs --warnskippedevents --warnnocode --ignore ./work/in/progress | metadoc-md
```

## Additional Flags

Each flag (except `--output`) can receive a `true`/`false` to enable/disable a feature. For example, to explicitly disable GFM, use `--gfm false`.

- `--output` Specify a custom output file name.
- `--pedantic` Conform to the original markdown.pl as much as possible. Don't fix original markdown bugs or behavior. Turns off and overrides gfm.
- `--gfm` Apply [Github Flavored Markdown](https://github.github.com/gfm/). Enabled by default
- `--tables` When using `gfm`, use [GFM Tables extension](https://github.github.com/gfm/#tables-extension-). Enabled by default.
- `--breaks` 	If true, use GFM hard and soft line breaks. Requires `gfm` be true.
- `--smartlists` If true, use smarter list behavior than those found in markdown.pl.
- `--smartypants` If true, use "smart" typographic punctuation for things like quotes and dashes.
- `--xhtml` If true, emit self-closing HTML tags for void elements (<br/>, <img/>, etc.) with a "/" as required by XHTML.
- `--svg` Renders mermaid SVG files. See mermaid support secction below.

These features are all implemented by passing configuration values into [marked configuration options](https://marked.js.org/#/USING_ADVANCED.md#options).

## Mermaid Support

[Mermaid](https://github.com/knsv/mermaid) is a powerful utility for generating graphical SVG diagrams from text. It follows a markdown-like approach. metadoc-md can identify mermaid code.

For example:

_Before metadoc-md:_

```sh
\`\`\`mermaid
graph LR
a-->b;
b-->c;
\`\`\`
```

_After metadoc-md:_

```html
<div id="mermaid1" class="mermaid">
  graph LR
  a-->b;
  b-->c;
</div>
```

As shown above, metadoc-md identifies mermaid code and generates the HTML container for it. However; it does not generate any SVG graphics.

Generating the SVG graphic can be done in the browser at runtime. The [mermaid UI library](https://www.jsdelivr.com/package/npm/mermaid) can parse the HTML and replace it with an SVG graphic. See the [usage instructions](https://mermaidjs.github.io/mermaidAPI.html)) for detail. As example, the output from metadoc-md could be used to generate an image like:

![Mermaid Graph](https://mermaidjs.github.io/mermaid-live-editor/#/view/eyJjb2RlIjoiZ3JhcGggTFJcbmEtLT5iO1xuYi0tPmM7IiwibWVybWFpZCI6eyJ0aGVtZSI6ImRlZmF1bHQifX0)

## MathJAX Support

[MathJax](http://mathjax.org/) will generate mathematical displays from standard text. Metadoc-md supports this using a markdown-like approach to identify MathJax equations.

For example:

_Before metadoc-md:_

```sh
\`\`\`math-tex
x = {-b \pm \sqrt{b^2-4ac} \over 2a}
\`\`\`
```

_After metadoc-md:_

```html
<div id="math1" class="math">
  x = {-b \pm \sqrt{b^2-4ac} \over 2a}
</div>
```

As shown above, metadoc-md identifies MathJax code and generates the HTML container for it. Notice the language is `math-tex`, indicating the equation content is LaTeX format. `math-inlinetex`, `math-asciimath`, and `math-mathml` are also supported. However; this does not generate any graphics.

Generating a graphic can be done in the browser at runtime. See the [MathJax Getting Started Guide](https://www.mathjax.org/#gettingstarted) for details.

The runtime library can generate images, such as this:

<div style="text-align: center; width: 100%;">
![MathJax](![Input](https://github.com/author/metadoc-md/raw/master/mathjax.png))
</div>
