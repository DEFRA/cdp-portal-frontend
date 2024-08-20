import { routeLookup } from '~/src/server/common/helpers/route-lookup'
import { getErrorSync, NoErrorThrownError } from '~/test-helpers/get-error'

describe('#routeLookup', () => {
  const mockRoutes = {
    home: {
      path: '/home'
    },
    'foo/bar': {
      path: '/foo/bar'
    },
    'services/serviceId': {
      path: '/services/{serviceId}'
    },
    'deployments/environment/deploymentId': {
      path: '/deployments/{environment}/{deploymentId}'
    },
    'deploy-service/details/{multiStepFormId?}': {
      path: '/deploy-service/details/{multiStepFormId?}'
    }
  }
  const mockServer = {
    lookup: (id) => mockRoutes[id]
  }

  test('Should provide a simple route', () => {
    expect(routeLookup(mockServer, 'home')).toEqual('/home')
  })

  test('Should provide a nested route', () => {
    expect(routeLookup(mockServer, 'foo/bar')).toEqual('/foo/bar')
  })

  test('Should provide a route with parameter substitution', () => {
    expect(
      routeLookup(mockServer, 'services/serviceId', {
        params: { serviceId: 'cdp-portal-frontend' }
      })
    ).toEqual('/services/cdp-portal-frontend')
  })

  test('Should provide a route with multiple parameter substitution', () => {
    expect(
      routeLookup(mockServer, 'deployments/environment/deploymentId', {
        params: {
          environment: 'infra-dev',
          deploymentId: '3f5dff54-9bea-4a53-830d-96610af8c2b4'
        }
      })
    ).toEqual('/deployments/infra-dev/3f5dff54-9bea-4a53-830d-96610af8c2b4')
  })

  test('Should provide a simple route with query params', () => {
    expect(routeLookup(mockServer, 'home', { query: { page: 1 } })).toEqual(
      '/home?page=1'
    )
  })

  test('Should provide many query params in a simple route', () => {
    expect(
      routeLookup(mockServer, 'home', { query: { page: 1, offset: 9 } })
    ).toEqual('/home?page=1&offset=9')
  })

  test('Should provide a route with path and query params', () => {
    expect(
      routeLookup(mockServer, 'deployments/environment/deploymentId', {
        params: {
          environment: 'management',
          deploymentId: '346463456456-9bea-4a53-4564646-456456'
        },
        query: {
          admin: true,
          environment: 'dev'
        }
      })
    ).toEqual(
      '/deployments/management/346463456456-9bea-4a53-4564646-456456?admin=true&environment=dev'
    )
  })

  test('Should safely escapes route path params', () => {
    expect(
      routeLookup(mockServer, 'services/serviceId', {
        params: { serviceId: 'cdp-user-service-backend-£$' }
      })
    ).toEqual('/services/cdp-user-service-backend-%C2%A3$')
  })

  test('Should escape url query params', () => {
    expect(
      routeLookup(mockServer, 'home', {
        query: { redirect: 'login=callback/url?info=true' }
      })
    ).toEqual('/home?redirect=login%3Dcallback%2Furl%3Finfo%3Dtrue')
  })

  test('Should error on an unknown route', () => {
    const error = getErrorSync(() => routeLookup(mockServer, 'nowt'))

    expect(error).not.toBeInstanceOf(NoErrorThrownError)
    expect(error).toBeInstanceOf(Error)
    expect(error).toHaveProperty(
      'message',
      'Request route lookup failed, no controller with id: nowt'
    )
  })

  describe('When optional param key is provided', () => {
    test('Should replace optional path params', () => {
      expect(
        routeLookup(mockServer, 'deploy-service/details/{multiStepFormId?}', {
          params: { multiStepFormId: '12345678' }
        })
      ).toEqual('/deploy-service/details/12345678')
    })

    test('Should replace optional path params and query params', () => {
      expect(
        routeLookup(mockServer, 'deploy-service/details/{multiStepFormId?}', {
          params: { multiStepFormId: '12345678' },
          query: { imageName: 'cdp-portal-frontend', version: '0.3.0' }
        })
      ).toEqual(
        '/deploy-service/details/12345678?imageName=cdp-portal-frontend&version=0.3.0'
      )
    })
  })

  describe('When optional param key is not provided', () => {
    test('Should remove optional path params', () => {
      expect(
        routeLookup(mockServer, 'deploy-service/details/{multiStepFormId?}')
      ).toEqual('/deploy-service/details/')
    })

    test('Should remove optional path params and query params', () => {
      expect(
        routeLookup(mockServer, 'deploy-service/details/{multiStepFormId?}', {
          query: { imageName: 'cdp-portal-frontend', version: '0.3.0' }
        })
      ).toEqual(
        '/deploy-service/details/?imageName=cdp-portal-frontend&version=0.3.0'
      )
    })
  })
})
