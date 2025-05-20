import { config } from '~/src/config/config.js'
import { removeNil } from '~/src/server/common/helpers/remove-nil.js'

function editTeam(request, teamId, payload) {
  const endpoint = config.get('userServiceBackendUrl') + '/teams/' + teamId

  return request.authedFetchJson(endpoint, {
    method: 'patch',
    payload: removeNil({
      name: payload.name,
      description: payload.description,
      serviceCodes: payload.serviceCodes,
      alertEmailAddresses: payload.alertEmailAddresses,
      alertEnvironments: payload.alertEnvironments,
      github: payload.github
    })
  })
}

export { editTeam }
