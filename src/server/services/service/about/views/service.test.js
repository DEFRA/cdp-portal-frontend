import { nunjucksTestEnv } from '~/test-helpers/component-helpers.js'

describe('Services about page', () => {
  const passThrough = (item) => item

  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2025-02-25'))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  test('frontend service', () => {
    const rendered = nunjucksTestEnv.render(
      'services/service/about/views/service.njk',
      {
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

  test('backend service', () => {
    const rendered = nunjucksTestEnv.render(
      'services/service/about/views/service.njk',
      {
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
