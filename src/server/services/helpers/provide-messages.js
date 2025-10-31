import { obtainServiceUrls } from '../../common/helpers/service-urls/obtain-service-urls.js'

async function provideMessages(request, h) {
  const { shutteredUrls } = obtainServiceUrls(request.app.entity.environments)
  const response = request.response

  if (response.variety === 'view') {
    if (!response.source?.context) {
      response.source.context = {}
    }

    response.source.context.shutteredUrls = shutteredUrls
    response.source.context.entity = request.app.entity
  }

  return h.continue
}

export { provideMessages }
