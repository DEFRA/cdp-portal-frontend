import { isUsingBadNamingConventions } from '~/src/server/common/components/input-assistant/helpers/is-using-bad-naming-conventions'

describe('#isUsingBadNames', () => {
  test('Should report as expected when bad name is not used', () => {
    expect(isUsingBadNamingConventions('amazing-fantastic-service')).toEqual(
      false
    )
  })

  test('Should report bad name being used', () => {
    expect(isUsingBadNamingConventions('new-fantastic-service')).toEqual(true)
  })

  test('Should report version being used', () => {
    expect(isUsingBadNamingConventions('amazing-fantastic-service-v1')).toEqual(
      true
    )
  })

  test('Should report branch being used', () => {
    expect(isUsingBadNamingConventions('amazing-main-service')).toEqual(true)
  })

  test('Should report version being used anywhere', () => {
    expect(isUsingBadNamingConventions('amazing-fantastic-v4-service')).toEqual(
      true
    )
  })
})
