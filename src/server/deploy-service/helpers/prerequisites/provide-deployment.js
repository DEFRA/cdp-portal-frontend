import { sessionNames } from '~/src/server/common/constants/session-names'

const provideDeployment = {
  method: (request) => request.yar.get(sessionNames.deployment),
  assign: 'deployment'
}

export { provideDeployment }
