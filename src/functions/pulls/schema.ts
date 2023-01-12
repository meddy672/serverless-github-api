import { transpileSchema } from '@middy/validator/transpile';

export const responseSchema = transpileSchema({
  type: 'object',
  required: [ 'body', 'statusCode', 'headers', 'isBase64Encoded'],
  properties: {
    statusCode: {
      type: 'number'
    },
    body: {
      type: 'string'
    },
    headers: {
      type: 'object'
    },
    isBase64Encoded: {
      type: 'boolean'
    }
  },
})
