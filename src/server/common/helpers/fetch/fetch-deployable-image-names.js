import { fetchServices } from './fetch-entities.js'

/**
 * @typedef {object} Options
 * @property {import('@hapi/hapi').Request} request
 * @return [string]
 */
async function fetchDeployableImageNames({ request }) {
  const authedUser = await request.getUserSession()
  const userScopes = authedUser?.scope
  const teamIds = authedUser?.isAdmin ? [] : userScopes
  const services = await fetchServices({ teamIds })

  return services.map((e) => e.name)
}

export { fetchDeployableImageNames }
