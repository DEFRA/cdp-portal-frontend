import { config } from '#config/config.js'
import { fetchJson } from '#server/common/helpers/fetch/fetch-json.js'
import { scopes } from '@defra/cdp-validation-kit'

export const options = {
  auth: {
    mode: 'required',
    access: {
      scope: scopes.admin // TODO: Open to tenants
    }
  }
}

export default async function (request, h) {
  const workflowRunId = request.params.workflowRunId

  const { payload } = await fetchJson(
    `${config.get('portalBackendUrl')}/resources/requests/${workflowRunId}`
  )

  const { workflow, pullRequest } = payload
  const prUrl = pullRequest?.url

  return {
    workflow,
    prUrl
  }
}
