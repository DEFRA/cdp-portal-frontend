import qs from 'qs'
import Joi from 'joi'
import Boom from '@hapi/boom'

const searchHandlerRoute = {
  options: {
    validate: {
      payload: Joi.object({
        q: Joi.string().allow('').required(),
        qText: Joi.string().allow('')
      }),
      failAction: () => Boom.badRequest()
    }
  },
  handler: (request, h) => {
    const pageUrl = request.payload.q
    const qText = request.payload.qText

    if (!pageUrl?.endsWith('.md') && qText) {
      // User has pressed enter with text in the input without choosing a suggestion. Send to the search results page
      return h.redirect(
        '/documentation/search-results' +
          qs.stringify({ q: qText }, { addQueryPrefix: true })
      )
    }

    if (pageUrl && !pageUrl?.endsWith('.md') && !qText) {
      // Non js input
      return h.redirect(
        '/documentation/search-results' +
          qs.stringify({ q: pageUrl }, { addQueryPrefix: true })
      )
    }

    return h.redirect(
      pageUrl + qs.stringify({ q: qText }, { addQueryPrefix: true })
    )
  }
}

export { searchHandlerRoute }
