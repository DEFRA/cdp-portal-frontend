import { provideTestType } from '~/src/server/test-suites/helpers/provide-test-type.js'

describe('#provideTestType', () => {
  test('Should provide expected result, when topics include "journey"', () => {
    const result = provideTestType(['journey'])
    expect(result).toBe('Journey')
  })

  test('Should provide expected result, when topics include "performance"', () => {
    const result = provideTestType(['performance'])
    expect(result).toBe('Performance')
  })

  test('Should provide expected default result, when topics are not matched', () => {
    const result = provideTestType(['fish'])
    expect(result).toBe('Test suite')
  })
})
