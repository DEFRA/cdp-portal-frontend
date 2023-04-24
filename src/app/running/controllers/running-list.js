import { transformRunningToEntityRow } from '~/src/app/running/transformers/transform-running-to-entity-row'
import { fetchRunning } from '~/src/app/running/helpers/fetch-running'

const runningListController = {
  handler: async (request, h) => {
    const running = await fetchRunning()
    const entityRows = running.map(transformRunningToEntityRow)

    return h.view('running/views/running-list', {
      pageTitle: 'Running',
      heading: 'Running',
      entityRows
    })
  }
}

export { runningListController }
