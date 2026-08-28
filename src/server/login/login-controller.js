import { sessionNames } from '#server/common/constants/session-names.js'
import { config } from '#config/config.js'

const callbackPath = config.get('auth.oidc.loginCallbackUri')

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

  // Browsers read `\` as a separator, so `/\evil` is as off-site as `//evil`.
  if (/^[/\\]{2}/.test(relative)) {
    return defaultPath
  }

  // Don't redirect back to the auth callback page as the content can only be processed once.
  if (relative.startsWith(callbackPath)) {
    return defaultPath
  }

  return relative
}
