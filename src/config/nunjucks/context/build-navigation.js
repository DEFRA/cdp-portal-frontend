import { scopes } from '~/src/server/common/constants/scopes.js'

async function buildNavigation(request) {
  const authedUser = await request.getUserSession()

  const hasPostgresPermission = authedUser?.scope?.includes(
    scopes.restrictedTechPostgres
  )

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
      url: deployServicePath,
      isActive: request?.path?.includes(deployServicePath)
    },
    {
      text: 'Create',
      url: createPath,
      isActive: request?.path?.includes(createPath)
    }
  ]

  const primary = [
    {
      text: 'Home',
      url: request.routeLookup('home'),
      isActive: request?.path === '/'
    },
    {
      text: 'Documentation',
      url: documentationPath,
      isActive: request?.path?.includes(documentationPath)
    },
    {
      text: 'Services',
      url: servicesPath,
      isActive: request?.path?.includes(servicesPath)
    },
    {
      text: 'Test suites',
      url: testSuitesPath,
      isActive: request?.path?.includes(testSuitesPath)
    },
    {
      text: 'Utilities',
      url: request.routeLookup('utilities/templates'),
      isActive: request?.path?.includes('/utilities')
    },
    {
      text: 'Teams',
      url: request.routeLookup('teams'),
      isActive:
        request?.path?.includes('/teams') && !request?.path?.includes('admin')
    },
    {
      text: 'Deployments',
      url: request.routeLookup('deployments'),
      isActive: isActive('deployments')
    },
    {
      text: 'Running Services',
      url: runningServicesPath,
      isActive: request?.path?.includes(runningServicesPath)
    }
  ]

  if (hasPostgresPermission) {
    actions.unshift({
      text: 'Apply Changelog',
      url: applyChangelogPath,
      isActive: request?.path?.includes(applyChangelogPath)
    })
  }

  return {
    primary,
    actions,
    admin: authedUser?.isAdmin && [
      {
        text: 'Admin',
        url: adminPath,
        isActive: request?.path?.includes(adminPath)
      }
    ]
  }
}

export { buildNavigation }
