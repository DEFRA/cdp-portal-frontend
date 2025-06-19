import { buildNavigation } from '~/src/config/nunjucks/context/build-navigation.js'
import { scopes } from '~/src/server/common/constants/scopes.js'

const mockRequest = ({ path = '', auth = {} } = {}) => ({
  path,
  hasScope: (scope) => auth?.scope?.includes(scope),
  getUserSession: () => auth,
  routeLookup: (value) => (value === 'home' ? '/' : `/${value}`)
})

describe('#buildNavigation', () => {
  describe('When user is not authenticated', () => {
    test('Should provide expected navigation details', async () => {
      expect(await buildNavigation(mockRequest())).toEqual({
        actions: undefined,
        primary: [
          {
            current: false,
            text: 'Home',
            href: '/',
            attributes: {
              'data-testid': 'nav-home'
            }
          },
          {
            current: false,
            text: 'Documentation',
            href: '/documentation',
            attributes: {
              'data-testid': 'nav-documentation'
            }
          },
          {
            current: false,
            text: 'Services',
            href: '/services',
            attributes: {
              'data-testid': 'nav-services'
            }
          },
          {
            current: false,
            text: 'Test suites',
            href: '/test-suites',
            attributes: {
              'data-testid': 'nav-test-suites'
            }
          },
          {
            current: false,
            text: 'Utilities',
            href: '/utilities/templates',
            attributes: {
              'data-testid': 'nav-utilities'
            }
          },
          {
            current: false,
            text: 'Teams',
            href: '/teams',
            attributes: {
              'data-testid': 'nav-teams'
            }
          },
          {
            current: false,
            text: 'Deployments',
            href: '/deployments',
            attributes: {
              'data-testid': 'nav-deployments'
            }
          },
          {
            current: false,
            text: 'Running Services',
            href: '/running-services',
            attributes: {
              'data-testid': 'nav-running-services'
            }
          }
        ],
        admin: undefined
      })
    })
  })

  describe('When user is authenticated', () => {
    test('Should provide expected navigation details', async () => {
      expect(
        await buildNavigation(mockRequest({ auth: { isTenant: true } }))
      ).toEqual({
        actions: [
          {
            current: false,
            text: 'Deploy Service',
            href: '/deploy-service',
            attributes: {
              'data-testid': 'nav-deploy-service'
            }
          },
          {
            current: false,
            text: 'Create',
            href: '/create',
            attributes: {
              'data-testid': 'nav-create'
            }
          }
        ],
        primary: [
          {
            current: false,
            text: 'Home',
            href: '/',
            attributes: {
              'data-testid': 'nav-home'
            }
          },
          {
            current: false,
            text: 'Documentation',
            href: '/documentation',
            attributes: {
              'data-testid': 'nav-documentation'
            }
          },
          {
            current: false,
            text: 'Services',
            href: '/services',
            attributes: {
              'data-testid': 'nav-services'
            }
          },
          {
            current: false,
            text: 'Test suites',
            href: '/test-suites',
            attributes: {
              'data-testid': 'nav-test-suites'
            }
          },
          {
            current: false,
            text: 'Utilities',
            href: '/utilities/templates',
            attributes: {
              'data-testid': 'nav-utilities'
            }
          },
          {
            current: false,
            text: 'Teams',
            href: '/teams',
            attributes: {
              'data-testid': 'nav-teams'
            }
          },
          {
            current: false,
            text: 'Deployments',
            href: '/deployments',
            attributes: {
              'data-testid': 'nav-deployments'
            }
          },
          {
            current: false,
            text: 'Running Services',
            href: '/running-services',
            attributes: {
              'data-testid': 'nav-running-services'
            }
          }
        ],
        admin: undefined
      })
    })
  })

  describe('When user is Admin', () => {
    test('Should provide expected navigation details', async () => {
      expect(
        await buildNavigation(mockRequest({ auth: { isAdmin: true } }))
      ).toEqual({
        actions: [
          {
            current: false,
            text: 'Deploy Service',
            href: '/deploy-service',
            attributes: {
              'data-testid': 'nav-deploy-service'
            }
          },
          {
            current: false,
            text: 'Create',
            href: '/create',
            attributes: {
              'data-testid': 'nav-create'
            }
          }
        ],
        primary: [
          {
            current: false,
            text: 'Home',
            href: '/',
            attributes: {
              'data-testid': 'nav-home'
            }
          },
          {
            current: false,
            text: 'Documentation',
            href: '/documentation',
            attributes: {
              'data-testid': 'nav-documentation'
            }
          },
          {
            current: false,
            text: 'Services',
            href: '/services',
            attributes: {
              'data-testid': 'nav-services'
            }
          },
          {
            current: false,
            text: 'Test suites',
            href: '/test-suites',
            attributes: {
              'data-testid': 'nav-test-suites'
            }
          },
          {
            current: false,
            text: 'Utilities',
            href: '/utilities/templates',
            attributes: {
              'data-testid': 'nav-utilities'
            }
          },
          {
            current: false,
            text: 'Teams',
            href: '/teams',
            attributes: {
              'data-testid': 'nav-teams'
            }
          },
          {
            current: false,
            text: 'Deployments',
            href: '/deployments',
            attributes: {
              'data-testid': 'nav-deployments'
            }
          },
          {
            current: false,
            text: 'Running Services',
            href: '/running-services',
            attributes: {
              'data-testid': 'nav-running-services'
            }
          }
        ],
        admin: [
          {
            current: false,
            text: 'Admin',
            href: '/admin',
            attributes: {
              'data-testid': 'nav-admin'
            }
          }
        ]
      })
    })

    describe('When user has postgres permission', () => {
      test('Should provide expected navigation details', async () => {
        expect(
          await buildNavigation(
            mockRequest({
              auth: { isTenant: true, scope: [scopes.restrictedTechPostgres] }
            })
          )
        ).toEqual({
          actions: [
            {
              current: false,
              text: 'Apply Changelog',
              href: '/apply-changelog',
              attributes: {
                'data-testid': 'nav-apply-changelog'
              }
            },
            {
              current: false,
              text: 'Deploy Service',
              href: '/deploy-service',
              attributes: {
                'data-testid': 'nav-deploy-service'
              }
            },
            {
              current: false,
              text: 'Create',
              href: '/create',
              attributes: {
                'data-testid': 'nav-create'
              }
            }
          ],
          primary: [
            {
              current: false,
              text: 'Home',
              href: '/',
              attributes: {
                'data-testid': 'nav-home'
              }
            },
            {
              current: false,
              text: 'Documentation',
              href: '/documentation',
              attributes: {
                'data-testid': 'nav-documentation'
              }
            },
            {
              current: false,
              text: 'Services',
              href: '/services',
              attributes: {
                'data-testid': 'nav-services'
              }
            },
            {
              current: false,
              text: 'Test suites',
              href: '/test-suites',
              attributes: {
                'data-testid': 'nav-test-suites'
              }
            },
            {
              current: false,
              text: 'Utilities',
              href: '/utilities/templates',
              attributes: {
                'data-testid': 'nav-utilities'
              }
            },
            {
              current: false,
              text: 'Teams',
              href: '/teams',
              attributes: {
                'data-testid': 'nav-teams'
              }
            },
            {
              current: false,
              text: 'Deployments',
              href: '/deployments',
              attributes: {
                'data-testid': 'nav-deployments'
              }
            },
            {
              current: false,
              text: 'Running Services',
              href: '/running-services',
              attributes: {
                'data-testid': 'nav-running-services'
              }
            }
          ]
        })
      })
    })
  })

  test('Should mark matching href as Active', async () => {
    expect(
      await buildNavigation(mockRequest({ path: '/running-services' }))
    ).toEqual({
      actions: undefined,
      primary: [
        {
          current: false,
          text: 'Home',
          href: '/',
          attributes: {
            'data-testid': 'nav-home'
          }
        },
        {
          current: false,
          text: 'Documentation',
          href: '/documentation',
          attributes: {
            'data-testid': 'nav-documentation'
          }
        },
        {
          current: false,
          text: 'Services',
          href: '/services',
          attributes: {
            'data-testid': 'nav-services'
          }
        },
        {
          current: false,
          text: 'Test suites',
          href: '/test-suites',
          attributes: {
            'data-testid': 'nav-test-suites'
          }
        },
        {
          current: false,
          text: 'Utilities',
          href: '/utilities/templates',
          attributes: {
            'data-testid': 'nav-utilities'
          }
        },
        {
          current: false,
          text: 'Teams',
          href: '/teams',
          attributes: {
            'data-testid': 'nav-teams'
          }
        },
        {
          current: false,
          text: 'Deployments',
          href: '/deployments',
          attributes: {
            'data-testid': 'nav-deployments'
          }
        },
        {
          current: true,
          text: 'Running Services',
          href: '/running-services',
          attributes: {
            'data-testid': 'nav-running-services'
          }
        }
      ],
      admin: undefined
    })
  })
})
