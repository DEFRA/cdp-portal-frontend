import { config } from '~/src/config'
import { sessionNames } from '~/src/server/common/constants/session-names'

const triggerTestRunController = {
  options: {},
  handler: async (request, h) => {
    const testSuiteId = request.params.testSuiteId

    const deployTestSuiteUrl =
      config.get('selfServiceOpsApiUrl') + '/deploy-test-suite'
    const payload = {
      imageName: testSuiteId,
      environment: 'TODO' // get from request body or path or query param?
    }

    const response = await request.fetchWithAuth(deployTestSuiteUrl, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      request.yar.flash(
        sessionNames.globalValidationFailures,
        response.json().message
      )
    }

    return h.redirect('/test-suite/' + testSuiteId)
  }
}

export { triggerTestRunController }
