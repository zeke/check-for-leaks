const path = require('path')
const fs = require('fs')
const walk = require('walk-sync')
const anymatch = require('anymatch')
const parseIgnoreFile = require('./lib/parse-ignore-file')
const dangerousFilenames = [
  '.env',
  '.npmrc'
]

module.exports = function checkForLeaks (dir) {
  const leaks = []

  // if dir doesn't exist, assume is relative to CWD
  if (!fs.existsSync(dir)) {
    dir = path.join(__dirname, dir)
  }

  // find dangerous files in the directory tree
  const dangerfiles = walk(dir, {
    ignore: [
      '**/.git/**',
      '**/node_modules/**'
    ]
  }).filter(filename => dangerousFilenames.indexOf(path.basename(filename)) > -1)

  // bail if no dangerous files are present
  if (!dangerfiles.length) return leaks

  // look for git danger
  const gitignore = parseIgnoreFile(path.join(dir, '.gitignore'))

  dangerfiles
    .filter(filename => !anymatch(gitignore, filename))
    .forEach(filename => {
      leaks.push(`warning: ${filename} is not in your .gitignore file`)
    })

  // look for npm danger
  const npmignoreFile = path.join(dir, '.npmignore')

  // if .npmignore file doesn't exist, bail.
  // previous gitignore checks will have already surfaced leaks
  if (fs.existsSync(npmignoreFile)) {
    const npmignore = parseIgnoreFile(npmignoreFile)

    dangerfiles
      .filter(filename => !anymatch(npmignore, filename))
      .forEach(filename => {
        leaks.push(`warning: ${filename} is not in your .npmignore file`)
      })
  }

  return leaks
}
