import { renderPage } from '~/test-helpers/component-helpers.js'
import { serviceFixture } from '~/src/__fixtures__/services/service.js'
import { buildOptions } from '~/src/server/common/helpers/options/build-options.js'

function buildServiceAutomationContext({
  service,
  formOptions,
  formEnvironments
}) {
  const serviceId = service.serviceId

  return {
    isAdmin: true,
    tabDetails: {
      tabs: [
        {
          isActive: true,
          url: `services/${serviceId}/automation`
        }
      ]
    },
    pageTitle: `${serviceId} - Automation`,
    formValues: {
      environments: formEnvironments
    },
    service,
    autoDeployEnvironmentOptions: formOptions,
    breadcrumbs: [
      {
        text: 'Services',
        href: '/services'
      },
      {
        text: serviceId,
        href: `/services/${serviceId}`
      },
      {
        text: 'Automation'
      }
    ]
  }
}

const service = serviceFixture
const formOptions = buildOptions(['infra-dev', 'management'], false)
const formEnvironments = ['infra-dev', 'management']

describe('Service automation tab', () => {
  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2025-02-25'))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  test('Never deployed', () => {
    const rendered = renderPage(
      'services/service/automation/views/automation',
      buildServiceAutomationContext({
        service,
        formOptions: [],
        formEnvironments: []
      })
    )
    expect(rendered).toMatchFile()
  })

  test('Previously deployed', () => {
    const rendered = renderPage(
      'services/service/automation/views/automation',
      buildServiceAutomationContext({
        service,
        formOptions,
        formEnvironments: []
      })
    )
    expect(rendered).toMatchFile()
  })

  test('With auto deploy turned on', () => {
    const rendered = renderPage(
      'services/service/automation/views/automation',
      buildServiceAutomationContext({
        service,
        formOptions,
        formEnvironments
      })
    )
    expect(rendered).toMatchFile()
  })
})
