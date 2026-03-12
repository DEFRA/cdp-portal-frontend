import { fetchTestRun } from '#server/test-suites/helpers/fetch/fetch-test-run.js'

export const provideTestRun = {
  method: async function (request) {
    const runId = request.params?.runId

    return fetchTestRun(runId)
  },
  assign: 'testRun'
}
