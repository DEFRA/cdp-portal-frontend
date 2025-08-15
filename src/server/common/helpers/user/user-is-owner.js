import { userIsServiceOwner } from './user-is-service-owner.js'

function userIsOwnerDecorator(request) {
  /** @param {{ entity }} entity */
  return async (entity) => {
    const userSession = await request.getUserSession()
    const teams = entity.teams?.map((team) => team.teamId) ?? []

    return userIsServiceOwner(userSession)(teams)
  }
}

export { userIsOwnerDecorator }
