import { augmentStatus } from '~/src/server/deployments/helpers/augment-status'

describe('#augmentStatus', () => {
  test('Should provide expected "running" status', () => {
    expect(augmentStatus({ status: 'running', unstable: false })).toBe(
      'running'
    )
  })

  test('Should provide expected "pending" status', () => {
    expect(augmentStatus({ status: 'pending' })).toBe('pending')
  })

  test('Should provide expected "failed" status', () => {
    expect(augmentStatus({ status: 'stopped', unstable: true })).toBe('failed')
  })

  test('Should provide expected "requested" status', () => {
    expect(augmentStatus({ status: 'requested', unstable: true })).toBe(
      'requested'
    )
  })
})
