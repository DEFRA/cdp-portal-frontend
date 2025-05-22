import { renderPage } from '~/test-helpers/component-helpers.js'
import { buildOptions } from '~/src/server/common/helpers/options/build-options.js'
import { entityServicesFixture } from '~/src/__fixtures__/services/entities.js'

function buildServiceAutomationContext({
  entity,
  formOptions,
  formEnvironments
}) {
  const serviceId = entity.name

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
    entity,
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

const entity = entityServicesFixture.at(0)
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
      'services/service/automations/views/auto-deployments',
      buildServiceAutomationContext({
        entity,
        formOptions: [],
        formEnvironments: []
      })
    )
    expect(rendered).toMatchFile()
  })

  test('Previously deployed', () => {
    const rendered = renderPage(
      'services/service/automations/views/auto-deployments',
      buildServiceAutomationContext({
        entity,
        formOptions,
        formEnvironments: []
      })
    )
    expect(rendered).toMatchFile()
  })

  test('With auto deploy turned on', () => {
    const rendered = renderPage(
      'services/service/automations/views/auto-deployments',
      buildServiceAutomationContext({
        entity,
        formOptions,
        formEnvironments
      })
    )
    expect(rendered).toMatchFile()
  })
})
