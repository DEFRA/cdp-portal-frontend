import { userIsServiceOwner } from './user-is-service-owner.js'

function userIsOwnerDecorator(request) {
  /** @param {{ entity }} entity */
  return (entity) => {
    const userSession = request.auth.credentials
    const teams = entity.teams?.map((team) => team.teamId) ?? []

    return userIsServiceOwner(userSession)(teams)
  }
}

export { userIsOwnerDecorator }
