import { sessionNames } from '~/src/server/common/constants/session-names.js'

const provideCdpTeam = {
  method: (request) => request.yar.get(sessionNames.cdpTeam),
  assign: 'cdpTeam'
}

export { provideCdpTeam }
