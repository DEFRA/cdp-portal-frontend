import { provideTestRunStatusClassname } from '~/src/server/test-suites/helpers/provide-test-run-status-classname.js'

describe('#provideTestRunStatusClassname', () => {
  test('Should provide expected "starting" className', () => {
    expect(provideTestRunStatusClassname('starting')).toBe('app-tag--purple')
  })

  test('Should provide expected "inProgress" className', () => {
    expect(provideTestRunStatusClassname('in-progress')).toBe(
      'govuk-tag--light-blue'
    )
  })

  test('Should provide expected "stopping" className', () => {
    expect(provideTestRunStatusClassname('stopping')).toBe(
      'govuk-tag--turquoise'
    )
  })

  test('Should provide expected "finished" className', () => {
    expect(provideTestRunStatusClassname('finished')).toBe('govuk-tag--green')
  })

  test('Should provide expected "failed" className', () => {
    expect(provideTestRunStatusClassname('failed')).toBe('govuk-tag--red')
  })

  test('Should provide expected default className', () => {
    expect(provideTestRunStatusClassname('blimey!')).toBe('govuk-tag--blue')
  })
})
