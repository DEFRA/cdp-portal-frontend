import { add } from 'date-fns'
import { environments, scopes } from '@defra/cdp-validation-kit'

import { fetchCdpUser } from '../../admin/users/helpers/fetch/fetchers.js'
import { transformUserProfileToSummary } from '../helpers/user-profile-to-summary.js'
import { buildSuggestions } from '../../common/components/autocomplete/helpers/build-suggestions.js'
import { allowedBreakGlassEnvironments } from '../../services/service/terminal/helpers/allowed-break-glass-environments.js'

const userProfileController = {
  options: {
    id: 'user-profile',
    auth: {
      mode: 'required',
      access: {
        scope: [scopes.tenant, scopes.admin]
      }
    }
  },
  handler: async (request, h) => {
    const flash = request.state?.flash ?? {}
    const userSession = request.auth.credentials
    const userScopes = userSession.scope

    const cdpUser = await fetchCdpUser(userSession.id)
    const teams = cdpUser.teams
    const user = {
      ...cdpUser,
      isAdmin: userSession?.isAdmin,
      isTenant: userSession?.isTenant
    }

    const allowedEnvironments = allowedBreakGlassEnvironments({
      userScopes,
      teams
    })

    const environmentOptions = allowedEnvironments.length
      ? buildSuggestions(
          allowedEnvironments.map((env) => ({
            text: env,
            value: env
          }))
        )
      : []

    const expiresInHours = flash?.environment === environments.prod ? 2 : 24
    const expiresInISO = add(Date.now(), {
      hours: expiresInHours
    }).toISOString()

    return h
      .view('user-profile/views/profile', {
        pageTitle: `${user.name} - User Profile`,
        user,
        summaryList: transformUserProfileToSummary(user),
        lowerEnvironments: allowedEnvironments.filter(
          (env) => env !== environments.prod
        ),
        environmentOptions,
        flash,
        expiresInHours,
        expiresInISO
      })
      .unstate('flash')
  }
}

export { userProfileController }
