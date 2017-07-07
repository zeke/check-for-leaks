const path = require('path')
const {describe, it} = require('mocha')
require('chai').should()

const checkForLeaks = require('..')

describe('checkForLeaks', () => {
  it('detects .env exposed to git', () => {
    const leaks = checkForLeaks('test/fixtures/env_exposed_to_git')
    leaks.should.deep.equal([
      'warning: .env is not in your .gitignore file'
    ])
  })

  it('detects .env exposed to npm', () => {
    const leaks = checkForLeaks('test/fixtures/env_exposed_to_npm')
    leaks.should.deep.equal([
      'warning: .env is not in your .npmignore file'
    ])
  })

  it('detects .npmrc exposed to npm', () => {
    const leaks = checkForLeaks('test/fixtures/npmrc_exposed_to_npm')
    leaks.should.deep.equal([
      'warning: .npmrc is not in your .npmignore file'
    ])
  })

  it('detects .npmrc ignored by git and indirectly by npm', () => {
    const leaks = checkForLeaks('test/fixtures/npmrc_ignored_by_git_and_indirectly_by_npm')
    leaks.should.deep.equal([])
  })

  it('does not warn if no dangerous files are present', () => {
    const leaks = checkForLeaks('test/fixtures/no_secrets')
    leaks.should.deep.equal([])
  })

  it('properly handles fully qualified paths', () => {
    const fullPath = path.join(__dirname, 'fixtures/npmrc_exposed_to_git')
    const leaks = checkForLeaks(fullPath)
    leaks.should.deep.equal([
      'warning: .npmrc is not in your .gitignore file'
    ])
  })

  it('detects exposed files in subdiretories', () => {
    const leaks = checkForLeaks('test/fixtures/nested_npmrc_exposed_to_git')
    leaks.should.deep.equal([
      'warning: a/b/.npmrc is not in your .gitignore file'
    ])
  })
})
