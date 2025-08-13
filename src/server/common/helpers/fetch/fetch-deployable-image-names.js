import { fetchServices } from './fetch-entities.js'
import { userIsAdmin } from '../user/user-is-admin.js'

/**
 * @typedef {object} Options
 * @property {import('@hapi/hapi').Request} request
 * @return [string]
 */
async function fetchDeployableImageNames({ request }) {
  const params = {}
  const userSession = await request.getUserSession()
  if (!userIsAdmin(userSession)) {
    params['teamIds'] = userSession.scope
  }

  return (await fetchServices(params)).map((e) => e.name)
}

export { fetchDeployableImageNames }
