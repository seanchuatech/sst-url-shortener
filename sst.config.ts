/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'sst-url-shortener',
      home: 'aws',
      region: 'ap-southeast-1',
      providers: {
        aws: {
          region: 'us-east-1',
        },
      },
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      protect: ['production'].includes(input?.stage),
    }
  },
  async run() {
    // DynamoDB Table — Single Table Design
    const table = new sst.aws.Dynamo('UrlTable', {
      fields: {
        PK: 'string',
        SK: 'string',
      },
      primaryIndex: { hashKey: 'PK', rangeKey: 'SK' },
      ttl: 'expiresAt',
    })

    // API Gateway + Lambda (Hono)
    const api = new sst.aws.ApiGatewayV2('UrlApi')

    api.route('$default', {
      handler: 'packages/functions/src/api.handler',
      link: [table],
    })

    return {
      apiUrl: api.url,
    }
  },
})
