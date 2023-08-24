import { sessionNames } from '~/src/server/common/constants/session-names'

function saveToCdpTeam({ yar }, valueObj) {
  const key = sessionNames.cdpTeam
  const cdpTeam = yar.get(key)

  yar.set(key, { ...cdpTeam, ...valueObj })

  return yar.get(key)
}

export { saveToCdpTeam }
