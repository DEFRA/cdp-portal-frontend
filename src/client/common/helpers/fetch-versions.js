import { buildSelectOptions } from '~/src/common/helpers/build-select-options'

async function fetchVersions(value) {
  try {
    const response = await fetch(
      `deploy-service/available-versions?serviceName=${value}`
    )
    const versions = await response.json()

    return buildSelectOptions(versions, false)
  } catch (error) {
    throw new Error(error)
  }
}

export { fetchVersions }
