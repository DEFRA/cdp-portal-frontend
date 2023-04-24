import { getDeploymentStatusClassname } from '~/src/app/deployments/helpers/get-deployment-status-classname'

describe('#getDeploymentStatusClassname', () => {
  test('Should provide expected "deployed" className', () => {
    expect(getDeploymentStatusClassname('deployed')).toEqual('govuk-tag--green')
  })

  test('Should provide expected "failed" className', () => {
    expect(getDeploymentStatusClassname('failed')).toEqual('govuk-tag--red')
  })

  test('Should provide expected "pending" className', () => {
    expect(getDeploymentStatusClassname('pending')).toEqual('govuk-tag--purple')
  })

  test('Should provide expected default className', () => {
    expect(getDeploymentStatusClassname()).toEqual('govuk-tag--grey')
  })
})
