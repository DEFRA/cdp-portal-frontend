import { fetchServices } from '../../../common/helpers/fetch/fetch-entities.js'

function fetchFavouriteServices({ serviceFilter, teamIdFilter, userScopes }) {
  const teamIds = userScopes
    .filter((s) => s.startsWith('team:'))
    .map((s) => s.replace('team:', ''))

  const queryParams = {
    ...(serviceFilter ? { name: serviceFilter } : {}),
    ...(teamIdFilter ? { teamIds: [teamIdFilter] } : { teamIds })
  }

  return fetchServices(queryParams)
}

export { fetchFavouriteServices }
