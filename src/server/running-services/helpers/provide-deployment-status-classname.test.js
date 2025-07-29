import { provideDeploymentStatusClassname } from './provide-deployment-status-classname.js'

describe('#getDeploymentStatusClassname', () => {
  test('Should provide expected "running" className', () => {
    expect(provideDeploymentStatusClassname('running')).toBe(
      'item-detail--green'
    )
  })

  test('Should provide expected "stopping" className', () => {
    expect(provideDeploymentStatusClassname('stopping')).toBe(
      'item-detail--purple'
    )
  })

  test('Should provide expected "pending" className', () => {
    expect(provideDeploymentStatusClassname('pending')).toBe(
      'item-detail--purple'
    )
  })

  test('Should provide expected "requested" className', () => {
    expect(provideDeploymentStatusClassname('requested')).toBe(
      'item-detail--purple'
    )
  })

  test('Should provide expected "stopped" className', () => {
    expect(provideDeploymentStatusClassname('stopped')).toBe(
      'item-detail--light-blue'
    )
  })

  test('Should provide expected "undeployed" className', () => {
    expect(provideDeploymentStatusClassname('undeployed')).toBe(
      'item-detail--grey'
    )
  })

  test('Should provide expected default className', () => {
    expect(provideDeploymentStatusClassname()).toBe('item-detail--grey')
  })
})
