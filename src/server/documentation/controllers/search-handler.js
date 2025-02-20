import qs from 'qs'
import Joi from 'joi'
import Boom from '@hapi/boom'

const searchHandlerController = {
  options: {
    validate: {
      payload: Joi.object({
        q: Joi.string().allow('').required(),
        qText: Joi.string().allow('').required()
      }),
      failAction: () => Boom.badRequest()
    }
  },
  handler: (request, h) => {
    const pageUrl = request.payload.q
    const qText = request.payload.qText

    if (!pageUrl?.endsWith('.md') && qText) {
      // User has pressed enter with text in the input without choosing a suggestion. So let's provide them with the
      // first result for their word, or redirect to docs home if no results
      return h.redirect(
        '/documentation/search-results' +
          qs.stringify({ q: qText }, { addQueryPrefix: true })
      )
    }

    return h.redirect(
      pageUrl + qs.stringify({ q: qText }, { addQueryPrefix: true })
    )
  }
}

export { searchHandlerController }
