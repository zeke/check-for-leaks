const nixt = require('nixt')
const {describe, it} = require('mocha')

describe('checkForLeaks CLI', () => {
  it('writes to stderr and exits ungracefully when leaks are found', (done) => {
    nixt()
      .run('node cli.js test/fixtures/env_exposed_to_git')
      .stdout('')
      .stderr('warning: .env is not in your .gitignore file')
      .end(done)
  })

  it('exits quietly and gracefully when no leaks are found', (done) => {
    nixt()
      .run('node cli.js test/fixtures/no_secrets')
      .stdout('')
      .stderr('')
      .end(done)
  })
})
