import { populatePathParams } from './populate-path-params.js'

describe('populatePathParams', () => {
  test('Should replace single path parameter with corresponding value', () => {
    const result = populatePathParams({ id: 123 }, '/users/{id}')
    expect(result).toBe('/users/123')
  })

  test('Should replace multiple path parameters with corresponding values', () => {
    const result = populatePathParams(
      { userId: 123, postId: 456 },
      '/users/{userId}/posts/{postId}'
    )
    expect(result).toBe('/users/123/posts/456')
  })

  test('Should handle template with no parameters', () => {
    const result = populatePathParams({}, '/users/dashboard')
    expect(result).toBe('/users/dashboard')
  })

  test('Should handle complex parameter names', () => {
    const result = populatePathParams(
      { resourceId: 'abc123' },
      '/api/v1/resource/{resourceId}'
    )
    expect(result).toBe('/api/v1/resource/abc123')
  })

  test('Should handle optional param', () => {
    const result = populatePathParams({ id: 123456 }, '/users/{id?}')
    expect(result).toBe('/users/123456')
  })

  test('Should handle missing optional param', () => {
    const result = populatePathParams({}, '/users/{id?}')
    expect(result).toBe('/users')
  })
})
