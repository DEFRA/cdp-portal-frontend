import { requestRepublishPlatformStateMessages } from '../helpers/fetchers.js'

export const republishPlatformStateMessagesRoute = {
  options: {
    id: 'admin/debug/republish-platform-state-messages'
  },
  handler: async (request, h) => {
    await requestRepublishPlatformStateMessages(request)

    return h
      .response({ message: 'Republish platform state messages requested' })
      .type('application/json')
  }
}
