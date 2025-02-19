import qs from 'qs'
import Joi from 'joi'
import Boom from '@hapi/boom'

const searchResultsController = {
  options: {
    validate: {
      payload: Joi.object({
        q: Joi.string().allow('').required(),
        qText: Joi.string().allow('').required()
      }),
      failAction: () => Boom.badRequest()
    }
  },
  handler: async (request, h) => {
    const query = request.payload.q
    const qText = request.payload.qText

    // TODO do we need a message for users when nothing found?

    if ((!query || !query.endsWith('.md')) && qText) {
      // User has pressed enter with text in the input without choosing a suggestion. So let's provide them with the
      // first result for their word, or redirect to docs home if no results
      const { result } = await request.server.inject({
        method: 'GET',
        url: '/documentation/search?q=' + qText
      })

      if (result?.suggestions?.length) {
        return h.redirect(
          result.suggestions.at(0).value +
            qs.stringify({ q: qText }, { addQueryPrefix: true })
        )
      } else {
        return h.redirect('/documentation/')
      }
    }

    return h.redirect(
      query + qs.stringify({ q: qText }, { addQueryPrefix: true })
    )
  }
}

export { searchResultsController }
