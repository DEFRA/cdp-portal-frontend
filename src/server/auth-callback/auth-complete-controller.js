import { sessionNames } from '#server/common/constants/session-names.js'

export const authCompletePath = '/auth/complete'

const allServicesPath = '/services/all'
const servicesPath = '/services'

export const authCompleteController = {
  handler: (request, h) => {
    // Flash entries concatenate until read, so an abandoned sign in leaves a
    // stale referrer in front of this one.
    const returnPath = request.yar.flash(sessionNames.referrer).at(-1) ?? '/'
    const redirect =
      returnPath === servicesPath && request.auth.credentials?.isAdmin
        ? allServicesPath
        : returnPath

    request.logger.info(`Login complete, redirecting user to ${redirect}`)

    return h.redirect(redirect)
  }
}
