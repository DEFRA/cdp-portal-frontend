import { routeLookup } from '~/src/server/utilities/route-lookup/route-lookup'

describe('#routeLookup', () => {
  const routes = {
    home: { path: '/home' },
    foo: { path: '/baz/bar/foo' },
    'param.single': { path: '/user/{id}' },
    'param.many': { path: '/team/{teamId}/project/{projectId}/{page}' }
  }
  const server = {
    lookup: (id) => routes[id]
  }

  test('find a simple route without params', () => {
    expect(routeLookup(server, 'home')).toEqual('/home')
  })

  test('find a longer route', () => {
    expect(routeLookup(server, 'foo')).toEqual('/baz/bar/foo')
  })

  test('find a route with parameter substitution', () => {
    expect(routeLookup(server, 'param.single', { id: 1234 })).toEqual(
      '/user/1234'
    )
  })

  test('find a route with multiple parameter substitution', () => {
    expect(
      routeLookup(server, 'param.many', {
        teamId: 'infra',
        projectId: 'foo',
        page: 7
      })
    ).toEqual('/team/infra/project/foo/7')
  })

  test('query params in a simple route', () => {
    expect(routeLookup(server, 'home', { page: 1 })).toEqual('/home?page=1')
  })

  test('many query params in a simple route', () => {
    expect(routeLookup(server, 'home', { page: 1, offset: 9 })).toEqual(
      '/home?page=1&offset=9'
    )
  })

  test('many query params in a route with path params', () => {
    expect(
      routeLookup(server, 'param.many', {
        teamId: 'infra',
        projectId: 'foo',
        page: 7,
        admin: true,
        env: 'dev'
      })
    ).toEqual('/team/infra/project/foo/7?admin=true&env=dev')
  })

  test('it safely escapes route params', () => {
    expect(routeLookup(server, 'param.single', { id: '../admin' })).toEqual(
      '/user/..%2Fadmin'
    )
  })

  test('it escapes query params', () => {
    expect(routeLookup(server, 'home', { redirect: 'build&deploy' })).toEqual(
      '/home?redirect=build%26deploy'
    )
  })

  test('it errors on an unknown route', () => {
    expect(() => routeLookup(server, 'not-found')).toThrow()
  })
})
