const fs = require('fs')
const path = require('path')
const mocha = require('mocha')
const describe = mocha.describe
const nixt = require('nixt')
const tempy = require('tempy')
const mkdirp = require('make-dir').sync
const it = mocha.it
require('chai').should()

const checkForLeaks = require('..')

function write (dir, file, content) {
  // if file is like `foo/bar/baz.txt`, make its path first
  mkdirp(path.dirname(path.join(dir, file)))
  fs.writeFileSync(path.join(dir, file), content)
}

describe('checkForLeaks', () => {
  it('detects .env exposed to git', (done) => {
    const dir = tempy.directory()
    write(dir, '.env', 'SECRETS=yes')
    write(dir, '.gitignore', 'not-ignoring-dot-env')

    const leaks = checkForLeaks(dir)
    leaks.should.deep.equal([
      'warning: .env is not in your .gitignore file'
    ])

    nixt()
      .run(`node cli.js ${dir}`)
      .stdout('')
      .stderr('warning: .env is not in your .gitignore file')
      .end(done)
  })

  it('detects .env exposed to npm', () => {
    const dir = tempy.directory()
    write(dir, '.env', 'SECRETS=yes')
    write(dir, '.gitignore', '.env')
    write(dir, '.npmignore', '')

    const leaks = checkForLeaks(dir)
    leaks.should.deep.equal([
      'warning: .env is not in your .npmignore file'
    ])
  })

  it('detects .npmrc exposed to npm', () => {
    const dir = tempy.directory()
    write(dir, '.npmrc', 'save=true')
    write(dir, '.gitignore', '.npmrc')
    write(dir, '.npmignore', '')

    const leaks = checkForLeaks(dir)
    leaks.should.deep.equal([
      'warning: .npmrc is not in your .npmignore file'
    ])
  })

  it('detects .npmrc ignored by git and indirectly by npm', () => {
    const dir = tempy.directory()
    write(dir, '.npmrc', 'save=true')
    write(dir, '.gitignore', '.npmrc')

    const leaks = checkForLeaks(dir)
    leaks.should.deep.equal([])
  })

  it('does not warn if no dangerous files are present', (done) => {
    const dir = tempy.directory()
    const leaks = checkForLeaks(dir)
    leaks.should.deep.equal([])

    nixt()
      .run(`node cli.js ${dir}`)
      .stdout('')
      .stderr('')
      .end(done)
  })

  it('detects exposed files in subdirectories', (done) => {
    const dir = tempy.directory()
    write(dir, 'a/b/.npmrc', 'save=true')

    const leaks = checkForLeaks(dir)
    leaks.should.deep.equal([
      'warning: a/b/.npmrc is not in your .gitignore file'
    ])

    nixt()
      .run(`node cli.js ${dir}`)
      .stdout('')
      .stderr('warning: a/b/.npmrc is not in your .gitignore file')
      .end(done)
  })
})
