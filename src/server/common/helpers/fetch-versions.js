import { buildOptions } from '~/src/common/helpers/build-options'

async function fetchVersions(value) {
  try {
    const response = await fetch(
      `deploy-service/available-versions?serviceName=${value}`
    )
    const versions = await response.json()

    return buildOptions(versions, false)
  } catch (error) {
    throw new Error(error)
  }
}

export { fetchVersions }
