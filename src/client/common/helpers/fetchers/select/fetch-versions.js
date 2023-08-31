import { buildOptions } from '~/src/common/helpers/build-options'

async function fetchVersions(value) {
  const response = await fetch(
    `${location.origin}/cdp-portal-frontend/deploy-service/available-versions?serviceName=${value}`
  )
  const json = await response.json()

  if (response.ok) {
    return buildOptions(json, false)
  }

  throw new Error(json.message)
}

export { fetchVersions }
