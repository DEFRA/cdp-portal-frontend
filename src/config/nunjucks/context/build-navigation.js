import { scopes } from '@defra/cdp-validation-kit'

async function buildNavigation(request, userSession) {
  const hasPostgresPermission = request.hasScope(scopes.restrictedTechPostgres)
  const hasTestAsTenantPermission = request.hasScope(scopes.testAsTenant)

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
  const removeTestAsTenantPath = request.routeLookup('admin/removeTestAsTenant')
  const applyChangelogPath = request.routeLookup('apply-changelog')

  const actions = (userSession?.isTenant || userSession?.isAdmin) && [
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
      current: request?.path === '/' || request?.path?.startsWith('/blog'),
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
      text: 'Test Suites',
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

  const testAsTenantNav = hasTestAsTenantPermission
    ? [
        {
          text: 'Exit Test as Tenant Mode',
          href: removeTestAsTenantPath,
          attributes: {
            'data-testid': 'nav-admin'
          }
        }
      ]
    : undefined

  const admin = userSession?.isAdmin
    ? [
        {
          text: 'Admin',
          href: adminPath,
          current: request?.path?.includes(adminPath),
          attributes: {
            'data-testid': 'nav-admin'
          }
        }
      ]
    : testAsTenantNav

  return {
    primary,
    actions,
    admin
  }
}

export { buildNavigation }
