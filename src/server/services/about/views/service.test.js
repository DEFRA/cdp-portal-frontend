import { nunjucksTestEnv } from '~/test-helpers/component-helpers.js'

describe('Page rendering test for services about page', () => {
  function passThrough(item) {
    return item
  }

  beforeAll(function () {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2025-02-25T10:04:35Z').getTime())
  })

  afterAll(function () {
    jest.useRealTimers()
  })

  test('renders the page for a frontend service', () => {
    const rendered = nunjucksTestEnv.render(
      'services/about/views/service.njk',
      {
        getAssetPath: passThrough,
        routeLookup: passThrough,
        tabDetails: {
          label: 'Service tabs',
          tabs: [
            {
              isActive: true,
              url: 'services/my-frontend-service',
              label: 'About'
            }
          ]
        },
        pageTitle: 'my-frontend-service microservice',
        summaryList: [],
        vanityUrls: [
          {
            environment: 'infra-dev',
            urls: [
              {
                shuttered: false,
                enabled: true,
                url: 'https://my-frontend-service.infra-dev.microservice.com'
              },
              {
                shuttered: true,
                enabled: true,
                url: 'https://cdp-something-else.microservice.com'
              }
            ]
          },
          {
            environment: 'dev',
            urls: [
              {
                shuttered: false,
                enabled: true,
                url: 'https://my-frontend-service-dev.com'
              }
            ]
          }
        ],
        apiGateways: [],
        service: {
          serviceName: 'my-frontend-service123',
          isFrontend: true
        },
        isServiceOwner: false,
        environmentsWithADeployment: ['infra-dev', 'dev'],
        environments: ['infra-dev', 'dev', 'test', 'prod'],
        runningServices: [
          {
            environment: 'infra-dev',
            unstable: false,
            status: 'running',
            service: 'my-frontend-service',
            version: '0.0.2',
            cdpDeploymentId: 'abc12345',
            updated: '2025-02-10 12:34',
            statusClassName: 'govuk-tag--green'
          },
          {
            environment: 'dev',
            unstable: true,
            status: 'pending',
            service: 'my-frontend-service',
            version: '0.0.2',
            cdpDeploymentId: 'def9867436',
            updated: '2025-02-11 14:54',
            statusClassName: 'govuk-tag--purple'
          }
        ],
        latestPublishedImageVersions: [
          {
            tag: '0.0.1',
            created: '2025-01-25 10:00:00'
          },
          {
            tag: '0.0.2',
            created: '2025-01-27'
          },
          {
            tag: '0.0.3',
            created: '2025-01-28'
          }
        ],
        breadcrumbs: [
          {
            text: 'Services',
            href: '/services'
          },
          {
            text: 'my-frontend-service'
          }
        ]
      }
    )
    expect(rendered).toMatchFile()
  })

  test('renders the page for a backend service', () => {
    const rendered = nunjucksTestEnv.render(
      'services/about/views/service.njk',
      {
        getAssetPath: passThrough,
        routeLookup: passThrough,
        tabDetails: {
          label: 'Service tabs',
          tabs: [
            {
              isActive: true,
              url: 'services/my-backend-service',
              label: 'About'
            }
          ]
        },
        pageTitle: 'my-backend-service microservice',
        summaryList: [],
        apiGateways: [
          {
            environment: 'infra-dev',
            apis: [
              {
                shuttered: false,
                api: 'https://my-backend-service.infra-dev.microservice.com'
              },
              {
                shuttered: true,
                api: 'https://cdp-backend.microservice.com'
              }
            ]
          },
          {
            environment: 'dev',
            apis: [
              {
                shuttered: false,
                api: 'https://my-backend-service-dev.com'
              }
            ]
          }
        ],
        vanityUrls: [],
        service: {
          serviceName: 'my-backend-service',
          isFrontend: false
        },
        isServiceOwner: false,
        environmentsWithADeployment: ['infra-dev', 'dev'],
        environments: ['infra-dev', 'dev', 'test', 'prod'],
        runningServices: [
          {
            environment: 'infra-dev',
            unstable: false,
            status: 'running',
            service: 'my-backend-service',
            version: '0.1.2',
            cdpDeploymentId: 'abc12345',
            updated: '2025-02-10 12:34',
            statusClassName: 'govuk-tag--green'
          },
          {
            environment: 'dev',
            unstable: true,
            status: 'pending',
            service: 'my-backend-service',
            version: '0.2.2',
            cdpDeploymentId: 'def9867436',
            updated: '2025-02-11 14:54',
            statusClassName: 'govuk-tag--purple'
          }
        ],
        latestPublishedImageVersions: [
          {
            tag: '0.0.1',
            created: '2025-01-25 10:00:00'
          },
          {
            tag: '0.0.2',
            created: '2025-01-27'
          },
          {
            tag: '0.0.3',
            created: '2025-01-28'
          }
        ],
        breadcrumbs: [
          {
            text: 'Services',
            href: '/services'
          },
          {
            text: 'my-backend-service'
          }
        ]
      }
    )
    expect(rendered).toMatchFile(undefined, { fileExtension: '.html' })
  })
})
