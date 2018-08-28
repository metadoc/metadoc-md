#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const minimist = require('minimist-string')
const MDParser = require('./index')
const Parser = new MDParser()
const stdin = process.openStdin()
let content = ''

const getArg = arg => {
  if (process.argv.indexOf(arg) >= 0) {
    let nextVal = process.argv[process.argv.indexOf(arg) + 1]

    if (!nextVal) {
      return true
    }

    if (nextVal.startsWith('--')) {
      return true
    }

    if (['true', '1'].indexOf(nextVal.trim().toLowerCase()) >= 0) {
      return true
    }

    if (['false', '0'].indexOf(nextVal.trim().toLowerCase()) >= 0) {
      return false
    }

    return nextVal
  }

  return undefined
}

let source = getArg('--source')

Parser.on('complete', content => {
  content = JSON.stringify(content, null, 2)

  let output = getArg('--output')

  if (!output) {
    let args = minimist(process.env.npm_lifecycle_script)

    if (!output && args.hasOwnProperty('output')) {
      output = path.resolve(args.output)

      if (!output.endsWith('.json')) {
        output = path.join(output, 'api.json')
      }
    }
  }

  if (output) {
    fs.writeFileSync(output, content)
    process.exit(0)
  }

  if (source) {
    fs.writeFileSync(source, content)
    process.exit(0)
  }

  process.stdout.write(content)
  process.exit(0)
})

Parser.pedantic = getArg('--pedantic') || false
Parser.gfm = getArg('--gfm') || true
Parser.tables = getArg('--tables') || true
Parser.breaks = getArg('--breaks') || false
Parser.sanitize = getArg('--sanitize') || false
Parser.smartlists = getArg('--smartlists') || true
Parser.smartypants = getArg('--smartypants') || false
Parser.xhtml = getArg('--xhtml') || false

if (source) {
  Parser.source = fs.readFileSync(source).toString()
  Parser.process()
} else {
  let timer = setTimeout(() => {
    console.error('No input source available.')
    process.exit(1)
  }, 2000)

  stdin.on('data', d => {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }

    content += d.toString()
  })

  stdin.on('end', () => {
    Parser.source = content
    Parser.process()
  })
}
