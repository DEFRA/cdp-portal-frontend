import { sessionNames } from '#server/common/constants/session-names.js'

export const authCompletePath = '/auth/complete'

const allServicesPath = '/services/all'
const servicesPath = '/services'

export const authCompleteController = {
  handler: (request, h) => {
    const returnPath = request.yar.flash(sessionNames.referrer).at(0) ?? '/'
    const redirect =
      returnPath === servicesPath && request.auth.credentials?.isAdmin
        ? allServicesPath
        : returnPath

    request.logger.info(`Login complete, redirecting user to ${redirect}`)

    return h.redirect(redirect)
  }
}
