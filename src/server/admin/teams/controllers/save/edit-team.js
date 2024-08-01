import { editTeam } from '~/src/server/admin/teams/helpers/fetch'
import { sessionNames } from '~/src/server/common/constants/session-names'
import { setStepComplete } from '~/src/server/admin/teams/helpers/form'
import { provideCdpTeam } from '~/src/server/admin/teams/helpers/pre/provide-cdp-team'
import { noSessionRedirect } from '~/src/server/admin/teams/helpers/ext/no-session-redirect'

const editTeamController = {
  options: {
    ext: {
      onPreHandler: [noSessionRedirect]
    },
    pre: [provideCdpTeam]
  },
  handler: async (request, h) => {
    const cdpTeam = request.pre?.cdpTeam

    try {
      const { response } = await editTeam(request, cdpTeam.teamId, {
        name: cdpTeam.name,
        description: cdpTeam.description,
        github: cdpTeam.github,
        ...(cdpTeam.serviceCode && { serviceCodes: [cdpTeam.serviceCode] })
      })

      if (response.ok) {
        await setStepComplete(request, h, 'allSteps')

        request.yar.flash(sessionNames.notifications, {
          text: 'Team updated',
          type: 'success'
        })

        return h.redirect('/admin/teams/' + cdpTeam.teamId)
      }
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      return h.redirect('/admin/teams/summary')
    }
  }
}

export { editTeamController }
