import { fetchShutteringUrls } from '~/src/server/services/helpers/fetch/fetch-shuttering-urls.js'
import { sortKeyByEnv } from '~/src/server/common/helpers/sort/sort-by-env.js'
import { shutteringStatus } from '~/src/server/common/constants/shuttering.js'

async function provideMessages(request, h) {
  const shutteringDetailsResponse = await fetchShutteringUrls(
    request.params.serviceId
  )
  const shutteringDetails = shutteringDetailsResponse.toSorted(
    sortKeyByEnv('environment')
  )
  const shutteredUrls = shutteringDetails.filter(
    (detail) => detail.status === shutteringStatus.shuttered
  )

  const response = request.response

  if (response.variety === 'view') {
    if (!response.source?.context) {
      response.source.context = {}
    }

    response.source.context.shutteringDetails = shutteringDetails
    response.source.context.shutteredUrls = shutteredUrls
    response.source.context.entity = request.app.entity
  }

  return h.continue
}

export { provideMessages }
