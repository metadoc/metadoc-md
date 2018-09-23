const path = require('path')
const marked = require('marked')
const traverse = require('traverse')
const MetadocPlugin = require('@author.io/metadoc-plugin')

// NOTICE: Mermaid doesn't support server side SVG Rendering yet
// due to lack of dependencies on JSDOM and deprecation of PhantomJS.
// See https://github.com/knsv/mermaid/issues/559.
// let mermaidId = 0
// const mermaid = require('mermaid')
// mermaid.initialize()
// const renderMermaidSvg = function (code) {
//   return new Promise(resolve => {
//     mermaid.render(`mermaid${mermaidId++}`, code, svg => {
//       resolve(svg)
//     })
//   })
// }

class Parser extends MetadocPlugin {
  constructor () {
    super(...arguments)

    this.NAME = require(path.join(__dirname, 'package.json')).name

    this.md = {
      pedantic: false,
      gfm: true,
      tables: true,
      breaks: false,
      smartLists: true,
      smartypants: false,
      xhtml: false,
      svg: true
    }
  }

  get pedantic () {
    return this.md.pedantic
  }

  get gfm () {
    return this.md.gfm
  }

  get tables () {
    return this.md.tables
  }

  get breaks () {
    return this.md.breaks
  }

  get smartLists () {
    return this.md.get
  }

  get smartypants () {
    return this.md.get
  }

  get xhtml () {
    return this.md.xhtml
  }

  set pedantic (value) {
    this.md.pedantic = value
  }

  set gfm (value) {
    this.md.gfm = value
  }

  set tables (value) {
    this.md.tables = value
  }

  set breaks (value) {
    this.md.breaks = value
  }

  set smartLists (value) {
    this.md.smartLists = value
  }

  set smartypants (value) {
    this.md.smartypants = value
  }

  set xhtml (value) {
    this.md.xhtml = value
  }

  process () {
    let mermaidId = 0
    let mathId = 0
    let renderer = new marked.Renderer()

    // Add mermaid SVG support
    // const me = this
    // renderer.code = async function (code, language) {
    //   if (code.match(/^sequenceDiagram/)||code.match(/^graph/)||code.match(/^gantt/) || language === 'sequenceDiagram' || language === 'graph' || language === 'gantt' && code !== '' || language === 'mermaid') {
    //     return await renderMermaidSvg(code)
    //   }
    // }

    const originalRenderer = renderer.code

    renderer.code = function (code, language, escaped) {
      // Mermaid Support
      if (code.match(/^sequenceDiagram/) || code.match(/^classDiagram/) || code.match(/^gitGraph/) || code.match(/^graph/) || code.match(/^gantt/) || language === 'sequenceDiagram' || language === 'classDiagram' || language === 'graph' || language === 'gitGraph' || (language === 'gantt' && code !== '') || language === 'mermaid') {
        return `<div id="mermaid${mermaidId}" class="mermaid ${language}">${code}</div>`
      }

      if (language) {
        // MathJAX Support
        if (language.startsWith('math') || language.startsWith('mathjax')) {
          if (language.toLowerCase() === 'mathml') {
            language = 'MathML'
          } else if (language.toLowerCase() === 'tex' || language.toLowerCase() === 'latex') {
            language = 'TeX'
          } else if (language.toLowerCase() === 'inlinetex') {
            language = 'inline-TeX'
          } else if (language.toLowerCase() === 'asciimath') {
            language = 'AsciiMath'
          } else if (language.indexOf('-') > 0) {
            language = language.splt('-').pop()
          }

          return `<div id="math${mathId}" class="math ${['tex', 'inline-tex', 'asciimath', 'mathml'].indexOf(language.trim().toLowerCase()) >= 0 ? language : 'tex'}">${code}</div>`
        }
      }

      return originalRenderer.call(renderer, ...arguments)
    }

    marked.setOptions({
      renderer,
      pedantic: this.md.pedantic,
      gfm: this.md.gfm,
      tables: this.md.tables,
      breaks: this.md.breaks,
      smartLists: this.md.smartlists,
      smartypants: this.md.smartypants,
      xhtml: this.md.xhtml
    })

    traverse(this.SOURCE || {}).forEach(function () {
      try {
        if (this.isLeaf && this.key === 'description' && this.node) {
          this.update(marked(this.node))
        }
      } catch (e) {
        console.error(e)
      }
    })

    this.emit('complete', this.SOURCE)
  }
}

module.exports = Parser
