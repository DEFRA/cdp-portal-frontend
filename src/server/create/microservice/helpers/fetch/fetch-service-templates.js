import { config } from '../../../../../config/config.js'

async function fetchServiceTemplates(request) {
  const endpoint = config.get('selfServiceOpsUrl') + '/service-templates'

  const { payload } = await request.authedFetchJson(endpoint)
  return payload
}

async function serviceTemplateIdsForNamesAndRepos(request) {
  const { serviceTemplates } = await fetchServiceTemplates(request)
  return serviceTemplates.map(({ id, templateName }) => ({
    value: id,
    text: templateName
  }))
}

export { fetchServiceTemplates, serviceTemplateIdsForNamesAndRepos }
