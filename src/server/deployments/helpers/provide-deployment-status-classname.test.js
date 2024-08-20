import { provideDeploymentStatusClassname } from '~/src/server/deployments/helpers/provide-deployment-status-classname'

describe('#getDeploymentStatusClassname', () => {
  test('Should provide expected "running" className', () => {
    expect(provideDeploymentStatusClassname('running')).toBe('govuk-tag--green')
  })

  test('Should provide expected "stopping" className', () => {
    expect(provideDeploymentStatusClassname('stopping')).toBe(
      'govuk-tag--purple'
    )
  })

  test('Should provide expected "pending" className', () => {
    expect(provideDeploymentStatusClassname('pending')).toBe(
      'govuk-tag--purple'
    )
  })

  test('Should provide expected "requested" className', () => {
    expect(provideDeploymentStatusClassname('requested')).toBe(
      'govuk-tag--purple'
    )
  })

  test('Should provide expected "stopped" className', () => {
    expect(provideDeploymentStatusClassname('stopped')).toBe(
      'govuk-tag--light-blue'
    )
  })

  test('Should provide expected default className', () => {
    expect(provideDeploymentStatusClassname()).toBe('govuk-tag--grey')
  })
})
