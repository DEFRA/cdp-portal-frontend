import { isUsingBadNamingConventions } from './is-using-bad-naming-conventions.js'

describe('#isUsingBadNames', () => {
  test('Should report as expected when bad name is not used', () => {
    expect(isUsingBadNamingConventions('amazing-fantastic-service')).toBe(false)
  })

  test('Should report bad name being used', () => {
    expect(isUsingBadNamingConventions('new-fantastic-service')).toBe(true)
  })

  test('Should report version being used', () => {
    expect(isUsingBadNamingConventions('amazing-fantastic-service-v1')).toBe(
      true
    )
  })

  test('Should report branch being used', () => {
    expect(isUsingBadNamingConventions('amazing-main-service')).toBe(true)
  })

  test('Should report version being used anywhere', () => {
    expect(isUsingBadNamingConventions('amazing-fantastic-v4-service')).toBe(
      true
    )
  })
})
