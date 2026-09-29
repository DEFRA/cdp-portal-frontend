import { config } from '#config/config.js'
import { fetchJson } from './fetch-json.js'
import { entitySubTypes } from '@defra/cdp-validation-kit'

export async function fetchDeployServiceOptions(isPrototype = false) {
  const endpoint = new URL(
    '/deploy-service/options',
    config.get('selfServiceOpsUrl')
  )

  if (isPrototype) {
    endpoint.searchParams.set('subtype', entitySubTypes.prototype)
  }

  const { payload } = await fetchJson(endpoint.toString())

  return payload
}
