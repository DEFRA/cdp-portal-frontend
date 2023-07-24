import { buildSelectOptions } from '~/src/common/helpers/build-select-options'

async function fetchVersions(value) {
  try {
    const response = await fetch(`available-versions?serviceName=${value}`) // TODO absolute name
    const versions = await response.json()

    return buildSelectOptions(versions, false)
  } catch (error) {
    throw new Error(error)
  }
}

export { fetchVersions }
