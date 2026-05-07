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

    // pageUrl may be 'path/to/file.md' or 'path/to/file.md#anchor'
    const isDocPage = /\.md(#[^?]*)?$/.test(pageUrl ?? '')

    if (!isDocPage && qText) {
      // User has pressed enter with text in the input without choosing a suggestion. Send to the search results page
      return h.redirect(
        '/documentation/search-results' +
          qs.stringify({ q: qText }, { addQueryPrefix: true })
      )
    }

    if (pageUrl && !isDocPage && !qText) {
      // Non js input
      return h.redirect(
        '/documentation/search-results' +
          qs.stringify({ q: pageUrl }, { addQueryPrefix: true })
      )
    }

    const [pagePath, anchor] = (pageUrl ?? '').split('#')
    return h.redirect(
      pagePath +
        qs.stringify({ q: qText }, { addQueryPrefix: true }) +
        (anchor ? `#${anchor}` : '')
    )
  }
}

export { searchHandlerRoute }
