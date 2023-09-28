import { sessionNames } from '~/src/server/common/constants/session-names'

const provideUser = {
  method: (request) => request.yar.get(sessionNames.user),
  assign: 'user'
}

export { provideUser }
