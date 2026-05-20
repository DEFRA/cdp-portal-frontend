import { sessionNames } from '#server/common/constants/session-names.js'

export const loginController = {
  options: {
    auth: false
  },
  handler: async (request, h) => {
    const refererPath = getRefererAsRelativeURL(request?.info?.referrer, '/')
    request.yar.flash(sessionNames.referrer, refererPath)
    return request.login(h)
  }
}

const callbackPath = '/auth/callback'

function getRefererAsRelativeURL(referer, defaultPath) {
  let relative = defaultPath
  if (referer) {
    try {
      const url = new URL(referer)
      relative = url.pathname + url.search
    } catch {
      if (referer.startsWith('/')) {
        relative = referer
      }
    }
  }

  // Don't redirect back to the auth callback page as the content can only be processed once.
  if (relative.startsWith(callbackPath)) {
    relative = defaultPath
  }

  return relative
}
