import { buildOptions } from '~/src/common/helpers/build-options'

async function fetchVersions(value) {
  const response = await fetch(
    `deploy-service/available-versions?serviceName=${value}`
  )
  const json = await response.json()

  if (response.ok) {
    return buildOptions(json, false)
  }

  throw Error(json.message)
}

export { fetchVersions }
