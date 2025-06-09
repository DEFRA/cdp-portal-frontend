import { faviconState } from '~/src/server/common/constants/favicon-state.js'
import { deploymentStatus } from '~/src/server/common/constants/deployment.js'
import { deploymentFaviconState } from '~/src/server/deployments/helpers/deployment-favicon-state.js'

describe('deploymentFaviconState', () => {
  test('returns pending favicon for stopping status', () => {
    expect(deploymentFaviconState(deploymentStatus.stopping)).toBe(
      faviconState.pending
    )
  })

  test('returns pending favicon for pending status', () => {
    expect(deploymentFaviconState(deploymentStatus.pending)).toBe(
      faviconState.pending
    )
  })

  test('returns pending favicon for requested status', () => {
    expect(deploymentFaviconState(deploymentStatus.requested)).toBe(
      faviconState.pending
    )
  })

  test('returns success favicon for running status', () => {
    expect(deploymentFaviconState(deploymentStatus.running)).toBe(
      faviconState.success
    )
  })

  test('returns stopped favicon for stopped status', () => {
    expect(deploymentFaviconState(deploymentStatus.stopped)).toBe(
      faviconState.stopped
    )
  })

  test('returns failed favicon for failed status', () => {
    expect(deploymentFaviconState(deploymentStatus.failed)).toBe(
      faviconState.failed
    )
  })

  test('returns undefined for an unknown status', () => {
    expect(deploymentFaviconState('unknown')).toBeUndefined()
  })

  test('returns undefined for an empty status', () => {
    expect(deploymentFaviconState('')).toBeUndefined()
  })

  test('returns undefined for a null status', () => {
    expect(deploymentFaviconState(null)).toBeUndefined()
  })

  test('returns undefined for an undefined status', () => {
    expect(deploymentFaviconState(undefined)).toBeUndefined()
  })
})
