import { populateUrls } from './populate-urls.js'

describe('#populateUrls', () => {
  test('Should return populated URLs for all templates with provided step data and params', () => {
    const stepData = { userId: '123', scopeId: '456' }
    const params = { teamId: '789' }
    const urlTemplates = {
      userUrl: '/user/{userId}',
      scopeUrl: '/scope/{scopeId}/team/{teamId}'
    }

    const result = populateUrls({ stepData, params, urlTemplates })

    expect(result).toEqual({
      userUrl: '/user/123',
      scopeUrl: '/scope/456/team/789'
    })
  })

  test('Should handle empty urlTemplates gracefully and returns an empty object', () => {
    const stepData = { userId: '123' }
    const params = { teamId: '789' }
    const urlTemplates = {}

    const result = populateUrls({ stepData, params, urlTemplates })

    expect(result).toEqual({})
  })

  test('Should override step data with params when keys overlap', () => {
    const stepData = { userId: '123', scopeId: '456' }
    const params = { userId: '999' }
    const urlTemplates = {
      userUrl: '/user/{userId}',
      scopeUrl: '/scope/{scopeId}'
    }

    const result = populateUrls({ stepData, params, urlTemplates })

    expect(result).toEqual({
      userUrl: '/user/999',
      scopeUrl: '/scope/456'
    })
  })

  test('Should return template with placeholders intact if no matching data is provided', () => {
    const stepData = {}
    const params = {}
    const urlTemplates = {
      userUrl: '/user/{userId}',
      scopeUrl: '/scope/{scopeId}'
    }

    const result = populateUrls({ stepData, params, urlTemplates })

    expect(result).toEqual({
      userUrl: '/user/{userId}',
      scopeUrl: '/scope/{scopeId}'
    })
  })

  test('Should handle null or undefined step data and params gracefully', () => {
    const stepData = null
    const params = undefined
    const urlTemplates = {
      userUrl: '/user/{userId}',
      scopeUrl: '/scope/{scopeId}'
    }

    const result = populateUrls({ stepData, params, urlTemplates })

    expect(result).toEqual({
      userUrl: '/user/{userId}',
      scopeUrl: '/scope/{scopeId}'
    })
  })
})
