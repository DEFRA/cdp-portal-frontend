import { provideStatusClassname } from '~/src/server/running-services/helpers/provide-status-classname.js'

describe('#getDeploymentStatusClassname', () => {
  test('Should provide expected "running" className', () => {
    expect(provideStatusClassname('running')).toBe('item-detail--green')
  })

  test('Should provide expected "stopping" className', () => {
    expect(provideStatusClassname('stopping')).toBe('item-detail--purple')
  })

  test('Should provide expected "pending" className', () => {
    expect(provideStatusClassname('pending')).toBe('item-detail--purple')
  })

  test('Should provide expected "requested" className', () => {
    expect(provideStatusClassname('requested')).toBe('item-detail--purple')
  })

  test('Should provide expected "stopped" className', () => {
    expect(provideStatusClassname('stopped')).toBe('item-detail--light-blue')
  })

  test('Should provide expected "undeployed" className', () => {
    expect(provideStatusClassname('undeployed')).toBe('item-detail--grey')
  })

  test('Should provide expected default className', () => {
    expect(provideStatusClassname()).toBe('item-detail--grey')
  })
})
