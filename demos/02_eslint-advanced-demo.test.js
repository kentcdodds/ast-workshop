const {stripIndent} = require('common-tags')
const {RuleTester} = require('eslint')
const rule = require('./02_eslint-advanced-demo')

const parserOptions = {
  ecmaVersion: 6,
  sourceType: 'module',
}

const ruleTester = new RuleTester()
ruleTester.run('no-old-bucket-streams-apis', rule, {
  valid: [
    valid(
      `
        import BucketStreamsAPI from 'bucket-streams-api'
        BucketStreamsAPI.get('/posts', {userId: '123', limit: 10})
      `,
    ),
    valid(
      `
        const BSA = require('bucket-streams-api')
        BSA.get('/posts', {userId: '123', limit: 10})
      `,
    ),
  ],
  invalid: [
    invalid(
      `
        import BucketStreamsAPI from 'bucket-streams-api'
        BucketStreamsAPI.request({
          url: '/followers',
          method: 'GET',
          userId: '123',
          limit: 10,
        })
      `,
    ),
    invalid(
      `
        import BSA from 'bucket-streams-api'
        BSA.request({
          url: '/posts',
          method: 'GET',
          userId: '123',
          limit: 10,
        })
      `,
    ),
    invalid(
      `
        const BSA = require('bucket-streams-api')
        BSA.request({
          url: '/posts',
          method: 'GET',
          userId: '123',
          limit: 10,
        })
      `,
    ),
  ],
})

function valid(code) {
  return {
    code: stripIndent([code.trim()]),
    parserOptions,
  }
}

function invalid(code) {
  return {
    code: stripIndent([code.trim()]),
    parserOptions,
    errors: [
      {
        message: 'The `request` API has been deprecated. Use `get`',
        type: 'Identifier',
      },
    ],
  }
}

// extra credit
// try to handle when it's imported like:
//   `import {default as BSA} from 'bucket-streams-api'`
// more extra credit
// try to handle when it's using desctructuring!
//   `const {request} = require('bucket-streams-api')
// try to write a fixer for it!
