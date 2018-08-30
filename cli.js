#!/usr/bin/env node
const fs = require('fs')
const MDParser = require('./index')
const Parser = new MDParser()

Parser.on('complete', content => Parser.writeOutput(content))

Parser.pedantic = Parser.getCLIArg('--pedantic') || false
Parser.gfm = Parser.getCLIArg('--gfm') || true
Parser.tables = Parser.getCLIArg('--tables') || true
Parser.breaks = Parser.getCLIArg('--breaks') || false
Parser.sanitize = Parser.getCLIArg('--sanitize') || false
Parser.smartlists = Parser.getCLIArg('--smartlists') || true
Parser.smartypants = Parser.getCLIArg('--smartypants') || false
Parser.xhtml = Parser.getCLIArg('--xhtml') || false

let source = Parser.getCLIArg('--source')

if (source) {
  Parser.source = fs.readFileSync(source).toString()
  Parser.process()
} else {
  Parser.monitorStdin()
}
