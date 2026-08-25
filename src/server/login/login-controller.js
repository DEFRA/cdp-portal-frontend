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

  // A path beginning `//` is a protocol-relative URL, so redirecting to it
  // would send the user off-site. Backslashes normalise to slashes, so `/\evil`
  // arrives here as `//evil` and is caught too.
  if (relative.startsWith('//')) {
    return defaultPath
  }

  // Don't redirect back to the auth callback page as the content can only be processed once.
  if (relative.startsWith(callbackPath)) {
    return defaultPath
  }

  return relative
}
