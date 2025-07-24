import { describe, expect, test } from 'vitest'
import { faviconState } from '../../common/constants/favicon-state.js'
import { databaseStatus } from '../constants/database-status.js'
import { databaseUpdateFaviconState } from './database-update-favicon-state.js'

describe('#databaseUpdateFaviconState', () => {
  test('returns pending favicon for inProgress status', () => {
    expect(databaseUpdateFaviconState(databaseStatus.inProgress)).toBe(
      faviconState.pending
    )
  })

  test('returns pending favicon for requested status', () => {
    expect(databaseUpdateFaviconState(databaseStatus.requested)).toBe(
      faviconState.pending
    )
  })

  test('returns success favicon for succeeded status', () => {
    expect(databaseUpdateFaviconState(databaseStatus.succeeded)).toBe(
      faviconState.success
    )
  })

  test('returns stopped favicon for stopped status', () => {
    expect(databaseUpdateFaviconState(databaseStatus.stopped)).toBe(
      faviconState.stopped
    )
  })

  test('returns stopped favicon for timedOut status', () => {
    expect(databaseUpdateFaviconState(databaseStatus.timedOut)).toBe(
      faviconState.stopped
    )
  })

  test('returns failed favicon for failed status', () => {
    expect(databaseUpdateFaviconState(databaseStatus.failed)).toBe(
      faviconState.failed
    )
  })

  test('returns failed favicon for fault status', () => {
    expect(databaseUpdateFaviconState(databaseStatus.fault)).toBe(
      faviconState.failed
    )
  })

  test('returns undefined for an unknown status', () => {
    expect(databaseUpdateFaviconState('unknown')).toBeUndefined()
  })

  test('returns undefined for an empty status', () => {
    expect(databaseUpdateFaviconState('')).toBeUndefined()
  })

  test('returns undefined for a null status', () => {
    expect(databaseUpdateFaviconState(null)).toBeUndefined()
  })

  test('returns undefined for an undefined status', () => {
    expect(databaseUpdateFaviconState(undefined)).toBeUndefined()
  })
})
