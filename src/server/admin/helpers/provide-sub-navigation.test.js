import { provideSubNavigation } from './provide-sub-navigation.js'

describe('#provideSubNavigation', () => {
  let request, h

  beforeEach(() => {
    request = {
      path: '',
      response: {
        variety: 'view',
        source: {
          context: {}
        }
      }
    }
    h = {
      continue: 'continue'
    }
  })

  test('Should add subNavigation to response context if variety is view', () => {
    request.path = '/admin/users'
    provideSubNavigation(request, h)

    expect(request.response.source.context.subNavigation).toBeDefined()
    expect(request.response.source.context.subNavigation).toHaveLength(6)
  })

  test('Should set isActive to true for the matching path', () => {
    request.path = '/admin/users'
    provideSubNavigation(request, h)

    const subNavigation = request.response.source.context.subNavigation
    expect(subNavigation.at(0).isActive).toBe(true)
    expect(subNavigation.at(1).isActive).toBe(false)
  })

  test('Should set isActive to false for non-matching paths', () => {
    request.path = '/admin/unknown'
    provideSubNavigation(request, h)

    const subNavigation = request.response.source.context.subNavigation
    subNavigation.forEach((item) => {
      expect(item.isActive).toBe(false)
    })
  })

  test('Should create context if it does not exist', () => {
    request.response.source.context = undefined
    provideSubNavigation(request, h)

    expect(request.response.source.context).toBeDefined()
  })

  test('Should return h.continue', () => {
    const result = provideSubNavigation(request, h)

    expect(result).toBe(h.continue)
  })
})
