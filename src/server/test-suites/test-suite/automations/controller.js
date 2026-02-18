export default {
  options: {
    id: `test-suites/{serviceId}/automations`
  },
  handler: async (request, h) => {
    const entity = request.app.entity
    const testSuiteName = entity.name

    return h.view('test-suites/test-suite/automations/views/automations', {
      pageTitle: `Test Suite - ${testSuiteName} - Automations`,
      entity,
      breadcrumbs: [
        {
          text: 'Test suites',
          href: '/test-suites'
        },
        {
          text: testSuiteName,
          href: `/test-suites/${testSuiteName}`
        },
        {
          text: 'Automations'
        }
      ]
    })
  }
}
