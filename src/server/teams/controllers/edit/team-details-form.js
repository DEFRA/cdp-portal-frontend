import Joi from 'joi'
import Boom from '@hapi/boom'

import { provideCdpTeam } from '~/src/server/admin/teams/helpers'
import { noSessionRedirect } from '~/src/server/teams/helpers/ext/no-session-redirect'

const teamDetailsFormController = {
  options: {
    ext: {
      onPreHandler: [noSessionRedirect]
    },
    pre: [provideCdpTeam],
    validate: {
      params: Joi.object({
        teamId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: (request, h) => {
    const cdpTeam = request.pre.cdpTeam
    const heading = 'Edit team'

    return h.view('teams/views/edit/team-details-form', {
      pageTitle: heading,
      heading,
      headingCaption: 'Edit your teams details',
      team: cdpTeam,
      breadcrumbs: [
        {
          text: 'Teams',
          href: '/teams'
        },
        {
          text: cdpTeam.name + ' team',
          href: '/teams/' + cdpTeam.teamId
        },
        {
          text: 'Edit team'
        }
      ]
    })
  }
}

export { teamDetailsFormController }
