import { sessionNames } from '~/src/server/common/constants/session-names'

const provideCdpUser = {
  method: (request) => request.yar.get(sessionNames.cdpUser),
  assign: 'cdpUser'
}

export { provideCdpUser }
