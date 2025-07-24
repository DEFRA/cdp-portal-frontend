import { describe, expect, test } from 'vitest'
import { provideDeploymentStatusClassname } from './provide-deployment-status-classname.js'

describe('#getDeploymentStatusClassname', () => {
  test('Should provide expected "running" className', () => {
    expect(provideDeploymentStatusClassname('running')).toBe('govuk-tag--green')
  })

  test('Should provide expected "stopping" className', () => {
    expect(provideDeploymentStatusClassname('stopping')).toBe('app-tag--purple')
  })

  test('Should provide expected "pending" className', () => {
    expect(provideDeploymentStatusClassname('pending')).toBe('app-tag--purple')
  })

  test('Should provide expected "requested" className', () => {
    expect(provideDeploymentStatusClassname('requested')).toBe(
      'app-tag--purple'
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
