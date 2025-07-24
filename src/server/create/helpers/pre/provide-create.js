import { sessionNames } from '../../../common/constants/session-names.js'

const provideCreate = {
  method: (request) => request.yar.get(sessionNames.create),
  assign: 'create'
}

export { provideCreate }
