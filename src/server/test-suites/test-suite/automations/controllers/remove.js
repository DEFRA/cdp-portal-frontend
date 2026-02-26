import { provideFormValues } from '../../../helpers/pre/provide-form-values.js'

export default {
  options: {
    id: `test-suites/{serviceId}/automations/schedules/remove`,
    pre: [provideFormValues]
  },
  handler: async (request, h) => {
    const entity = request.app.entity
    const testSuiteName = entity.name
    const scheduleId = request.params.scheduleId

    return h.view('test-suites/test-suite/automations/views/schedules-remove', {
      pageTitle: `Test Suite - ${testSuiteName} - Automations - Schedules - Remove`,
      entity,
      scheduleId,
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
          text: 'Automations',
          href: `/test-suites/${testSuiteName}/automations`
        },
        {
          text: 'Remove'
        }
      ]
    })
  }
}
