const test = require('tap').test

test('Sanity Check', t => {
  let md = require('../index')

  t.ok(typeof md === 'function', 'Markdown Parser class recognized.')

  t.end()
})
