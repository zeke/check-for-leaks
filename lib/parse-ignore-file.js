const fs = require('fs')
const parse = require('parse-gitignore')

module.exports = function parseIgnoreFile (file) {
  return (fs.existsSync(file)) ? parse(file) : []
}
