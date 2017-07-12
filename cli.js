#!/usr/bin/env node

const args = require('minimist')(process.argv.slice(2))
const check = require('.')
const dir = args._[0] || process.cwd()
const leaks = check(dir)

if (leaks.length) {
  console.error(leaks.join('\n'))
  process.exit(1)
} else {
  process.exit(0)
}
