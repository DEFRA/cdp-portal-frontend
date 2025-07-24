import { sessionNames } from '../../../../common/constants/session-names.js'

const provideCdpUser = {
  method: (request) => request.yar.get(sessionNames.cdpUser),
  assign: 'cdpUser'
}

export { provideCdpUser }
