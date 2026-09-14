import aws4 from 'aws4'
import { fromNodeProviderChain } from '@aws-sdk/credential-providers'

const credentialsProvider = fromNodeProviderChain()

export async function signedFetch(url, options = {}) {
  const credentials = await credentialsProvider()
  const parsed = new URL(url)

  const request = {
    ...options,
    host: parsed.host,
    path: parsed.pathname + parsed.search,
    service: 'execute-api',
    region: 'eu-west-2'
  }

  aws4.sign(request, credentials)

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...request.headers
    }
  })
}
