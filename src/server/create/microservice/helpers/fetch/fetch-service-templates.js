import { config } from '~/src/config/config.js'

async function fetchServiceTemplates(request) {
  const endpoint = config.get('selfServiceOpsUrl') + '/service-templates'

  const { payload } = await request.authedFetchJson(endpoint)
  return payload
}

async function serviceTemplatesForNamesAndRepos(request) {
  const { serviceTemplates } = await fetchServiceTemplates(request)
  return serviceTemplates.map(({ repositoryName, templateName }) => ({
    value: repositoryName,
    text: templateName
  }))
}

async function serviceTemplatesNames(request) {
  const { serviceTemplates } = await fetchServiceTemplates(request)
  return serviceTemplates.map(({ repositoryName }) => repositoryName)
}

export {
  fetchServiceTemplates,
  serviceTemplatesForNamesAndRepos,
  serviceTemplatesNames
}
