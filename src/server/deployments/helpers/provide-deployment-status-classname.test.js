import { provideDeploymentStatusClassname } from '~/src/server/deployments/helpers/provide-deployment-status-classname'

describe('#getDeploymentStatusClassname', () => {
  test('Should provide expected "running" className', () => {
    expect(provideDeploymentStatusClassname('running')).toEqual(
      'govuk-tag--green'
    )
  })

  test('Should provide expected "stopping" className', () => {
    expect(provideDeploymentStatusClassname('stopping')).toEqual(
      'govuk-tag--purple'
    )
  })

  test('Should provide expected "pending" className', () => {
    expect(provideDeploymentStatusClassname('pending')).toEqual(
      'govuk-tag--purple'
    )
  })

  test('Should provide expected "requested" className', () => {
    expect(provideDeploymentStatusClassname('requested')).toEqual(
      'govuk-tag--blue'
    )
  })

  test('Should provide expected "stopped" className', () => {
    expect(provideDeploymentStatusClassname('stopped')).toEqual(
      'govuk-tag--light-blue'
    )
  })

  test('Should provide expected default className', () => {
    expect(provideDeploymentStatusClassname()).toEqual('govuk-tag--grey')
  })
})
