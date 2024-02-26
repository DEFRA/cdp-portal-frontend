import { provideTestRunStatusClassname } from '~/src/server/test-suites/helpers/provide-test-run-status-classname'

describe('#provideTestRunStatusClassname', () => {
  test('Should provide expected "starting" className', () => {
    expect(provideTestRunStatusClassname('starting')).toEqual(
      'govuk-tag--purple'
    )
  })

  test('Should provide expected "inProgress" className', () => {
    expect(provideTestRunStatusClassname('in-progress')).toEqual(
      'govuk-tag--light-blue'
    )
  })

  test('Should provide expected "stopping" className', () => {
    expect(provideTestRunStatusClassname('stopping')).toEqual(
      'govuk-tag--turquoise'
    )
  })

  test('Should provide expected "finished" className', () => {
    expect(provideTestRunStatusClassname('finished')).toEqual(
      'govuk-tag--green'
    )
  })

  test('Should provide expected "failed" className', () => {
    expect(provideTestRunStatusClassname('failed')).toEqual('govuk-tag--red')
  })

  test('Should provide expected default className', () => {
    expect(provideTestRunStatusClassname('blimey!')).toEqual('govuk-tag--blue')
  })
})
