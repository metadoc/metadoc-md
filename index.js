const marked = require('marked')
const traverse = require('traverse')
const EventEmitter = require('events')
const fs = require('fs')

class Parser extends EventEmitter {
  constructor () {
    super(...arguments)

    this.md = {
      pedantic: false,
      gfm: true,
      tables: true,
      breaks: false,
      sanitize: false,
      smartLists: true,
      smartypants: false,
      xhtml: false
    }

    this.SOURCE = ''
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

  get sanitize () {
    return this.md.sanitize
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

  set sanitize (value) {
    this.md.sanitize = value
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

  get source () {
    return this.SOURCE
  }

  set source (value) {
    let data = value
    let filepath

    try {
      data = require(require('path').resolve(value))
      this.SOURCE = data
    } catch (e) {
      data = data.split('{')
      data.shift()
      data = `{${data.join('{')}`

      try {
        this.SOURCE = JSON.parse(data)
      } catch (e) {
        console.error(e)
        process.exit(1)
      }
    }

    this.emit('source', data)
  }

  process () {
    const me = this

    marked.setOptions({
      renderer: new marked.Renderer(),
      pedantic: this.md.pedantic,
      gfm: this.md.gfm,
      tables: this.md.tables,
      breaks: this.md.breaks,
      sanitize: this.md.sanitize,
      smartLists: this.md.smartLists,
      smartypants: this.md.smartypants,
      xhtml: this.md.xhtml
    })

    traverse(this.SOURCE || {}).forEach(function () {
      try {
        if (this.isLeaf && this.key === 'description') {
          if (this.node) {
            this.update(marked(this.node))
          }
        }
      } catch (e) {
        console.error(e)
      }
    })

    this.emit('complete', this.SOURCE)
  }
}

module.exports = Parser
