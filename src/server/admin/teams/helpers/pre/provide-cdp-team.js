import { sessionNames } from '~/src/server/common/constants/session-names'

const provideCdpTeam = {
  method: (request) => request.yar.get(sessionNames.cdpTeam),
  assign: 'cdpTeam'
}

export { provideCdpTeam }
