import { sessionNames } from '~/src/server/common/constants/session-names.js'

const provideCreate = {
  method: (request) => request.yar.get(sessionNames.create),
  assign: 'create'
}

export { provideCreate }
