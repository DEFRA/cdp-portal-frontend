import { scopes } from '~/src/server/common/constants/scopes.js'

async function buildNavigation(request) {
  const authedUser = await request.getUserSession()
  const hasPostgresPermission = request.hasScope(scopes.restrictedTechPostgres)

  const isActive = (value) => {
    const firstPathPart = request?.path?.split('/').at(1)
    return firstPathPart === value
  }

  const documentationPath = request.routeLookup('documentation')
  const servicesPath = request.routeLookup('services')
  const testSuitesPath = request.routeLookup('test-suites')
  const runningServicesPath = request.routeLookup('running-services')
  const deployServicePath = request.routeLookup('deploy-service')
  const createPath = request.routeLookup('create')
  const adminPath = request.routeLookup('admin')
  const applyChangelogPath = request.routeLookup('apply-changelog')

  const actions = (authedUser?.isTenant || authedUser?.isAdmin) && [
    {
      text: 'Deploy Service',
      href: deployServicePath,
      current: request?.path?.includes(deployServicePath),
      attributes: {
        'data-testid': 'nav-deploy-service'
      }
    },
    {
      text: 'Create',
      href: createPath,
      current: request?.path?.includes(createPath),
      attributes: {
        'data-testid': 'nav-create'
      }
    }
  ]

  const primary = [
    {
      text: 'Home',
      href: request.routeLookup('home'),
      current: request?.path === '/',
      attributes: {
        'data-testid': 'nav-home'
      }
    },
    {
      text: 'Documentation',
      href: documentationPath,
      current: request?.path?.includes(documentationPath),
      attributes: {
        'data-testid': 'nav-documentation'
      }
    },
    {
      text: 'Services',
      href: servicesPath,
      current: request?.path?.includes(servicesPath),
      attributes: {
        'data-testid': 'nav-services'
      }
    },
    {
      text: 'Test suites',
      href: testSuitesPath,
      current: request?.path?.includes(testSuitesPath),
      attributes: {
        'data-testid': 'nav-test-suites'
      }
    },
    {
      text: 'Utilities',
      href: request.routeLookup('utilities/templates'),
      current: request?.path?.includes('/utilities'),
      attributes: {
        'data-testid': 'nav-utilities'
      }
    },
    {
      text: 'Teams',
      href: request.routeLookup('teams'),
      current:
        request?.path?.includes('/teams') && !request?.path?.includes('admin'),
      attributes: {
        'data-testid': 'nav-teams'
      }
    },
    {
      text: 'Deployments',
      href: request.routeLookup('deployments'),
      current: isActive('deployments'),
      attributes: {
        'data-testid': 'nav-deployments'
      }
    },
    {
      text: 'Running Services',
      href: runningServicesPath,
      current: request?.path?.includes(runningServicesPath),
      attributes: {
        'data-testid': 'nav-running-services'
      }
    }
  ]

  if (hasPostgresPermission) {
    actions.unshift({
      text: 'Apply Changelog',
      href: applyChangelogPath,
      current: request?.path?.includes(applyChangelogPath),
      attributes: {
        'data-testid': 'nav-apply-changelog'
      }
    })
  }

  return {
    primary,
    actions,
    admin: authedUser?.isAdmin && [
      {
        text: 'Admin',
        href: adminPath,
        current: request?.path?.includes(adminPath),
        attributes: {
          'data-testid': 'nav-admin'
        }
      }
    ]
  }
}

export { buildNavigation }
