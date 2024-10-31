import Joi from 'joi'
import Boom from '@hapi/boom'
import { fetchCdpTeam } from '~/src/server/admin/teams/helpers/fetch/index.js'
import { transformDeleteTeamToEntityDataList } from '~/src/server/admin/teams/transformers/transform-delete-team-to-entity-data-list.js'

const confirmDeleteTeamController = {
  options: {
    validate: {
      params: Joi.object({
        teamId: Joi.string().uuid().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const { team } = await fetchCdpTeam(request.params?.teamId)

    const title = 'Confirm team deletion'

    return h.view('admin/teams/views/delete/confirm-delete-team', {
      pageTitle: title,
      heading: title,
      entityDataList: transformDeleteTeamToEntityDataList(team),
      team,
      breadcrumbs: [
        {
          text: 'Admin',
          href: '/admin'
        },
        {
          text: 'Teams',
          href: '/admin/teams'
        },
        {
          text: team.name,
          href: `/admin/teams/${team.teamId}`
        },
        {
          text: title
        }
      ]
    })
  }
}

export { confirmDeleteTeamController }
