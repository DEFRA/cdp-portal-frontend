import { isUsingBadNamingConventions } from '~/src/server/common/components/input-assistant/helpers/is-using-bad-naming-conventions'

describe('#isUsingBadNames', () => {
  test('Should report bad name being used', () => {
    expect(isUsingBadNamingConventions('new-fantastic-service')).toEqual(true)
  })

  test('Should report bad name not being used', () => {
    expect(isUsingBadNamingConventions('amazing-fantastic-service')).toEqual(
      false
    )
  })
})
