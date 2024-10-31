import { config } from '~/src/config/index.js'
import { removeNil } from '~/src/server/common/helpers/remove-nil.js'
import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { setStepComplete } from '~/src/server/admin/teams/helpers/form/index.js'
import { provideCdpTeam } from '~/src/server/admin/teams/helpers/pre/provide-cdp-team.js'
import { noSessionRedirect } from '~/src/server/admin/teams/helpers/ext/no-session-redirect.js'

const createTeamController = {
  options: {
    ext: {
      onPreHandler: [noSessionRedirect]
    },
    pre: [provideCdpTeam]
  },
  handler: async (request, h) => {
    const cdpTeam = request.pre?.cdpTeam
    const endpoint = config.get('userServiceBackendUrl') + '/teams'

    try {
      const { response } = await request.authedFetcher(endpoint, {
        method: 'post',
        body: JSON.stringify(
          removeNil({
            name: cdpTeam.name,
            description: cdpTeam.description,
            github: cdpTeam.github,
            serviceCodes: cdpTeam.serviceCode ? [cdpTeam.serviceCode] : []
          })
        )
      })

      if (response?.ok) {
        await setStepComplete(request, h, 'allSteps')

        request.yar.flash(sessionNames.notifications, {
          text: 'Team created',
          type: 'success'
        })

        return h.redirect('/admin/teams')
      }
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      return h.redirect('/admin/teams/summary')
    }
  }
}

export { createTeamController }
