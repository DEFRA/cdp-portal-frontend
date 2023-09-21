import { sessionNames } from '~/src/server/common/constants/session-names'

const provideAuth = {
  method: (request) => request.yar.get(sessionNames.auth),
  assign: 'auth'
}

export { provideAuth }
