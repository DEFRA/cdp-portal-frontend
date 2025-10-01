import { config } from '../../../../../config/config.js'
import qs from 'qs'

async function fetchServiceTemplates(request, queryFilter = {}) {
  const queryString = qs.stringify(queryFilter, { addQueryPrefix: true })
  const endpoint =
    config.get('selfServiceOpsUrl') + '/tenant-templates' + queryString

  const { payload } = await request.authedFetchJson(endpoint)
  return payload
}

async function serviceTemplateIdsForNamesAndRepos(request, queryFilter = {}) {
  const serviceTemplates = await fetchServiceTemplates(request, queryFilter)
  return serviceTemplates.map(({ id, templateName }) => ({
    value: id,
    text: templateName
  }))
}

export { fetchServiceTemplates, serviceTemplateIdsForNamesAndRepos }
