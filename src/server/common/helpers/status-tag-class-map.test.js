import { describe, expect, test } from 'vitest'
import { statusTagClassMap } from './status-tag-class-map.js'
import { creationStatuses } from '../constants/creation-statuses.js'

describe('#statusTagClassMap', () => {
  test('Should provide expected "raised" tag className', () => {
    expect(statusTagClassMap(creationStatuses.raised)).toBe('app-tag--purple')
  })

  test('Should provide expected "prOpen" tag className', () => {
    expect(statusTagClassMap(creationStatuses.raised)).toBe('app-tag--purple')
  })

  test('Should provide expected "in-progress" tag className', () => {
    expect(statusTagClassMap(creationStatuses.inProgress)).toBe(
      'app-tag--purple'
    )
  })

  test('Should provide expected "requested" tag className', () => {
    expect(statusTagClassMap(creationStatuses.requested)).toBe(
      'app-tag--purple'
    )
  })

  test('Should provide expected "not-requested" tag className', () => {
    expect(statusTagClassMap(creationStatuses.notRequested)).toBe(
      'govuk-tag--grey'
    )
  })

  test('Should provide expected "success" tag className', () => {
    expect(statusTagClassMap(creationStatuses.success)).toBe('govuk-tag--green')
  })

  test('Should provide expected "created" tag className', () => {
    expect(statusTagClassMap(creationStatuses.created)).toBe('govuk-tag--green')
  })

  test('Should provide expected "workflow_completed" tag className', () => {
    expect(statusTagClassMap(creationStatuses.workflowCompleted)).toBe(
      'govuk-tag--green'
    )
  })

  test('Should provide expected "failure" tag className', () => {
    expect(statusTagClassMap(creationStatuses.failure)).toBe('govuk-tag--red')
  })

  test('Should provide expected "unknown" tag className', () => {
    expect(statusTagClassMap(creationStatuses.unknown)).toBe('govuk-tag--red')
  })

  test('Should provide expected default tag className', () => {
    expect(statusTagClassMap('paddingtonBear')).toBe('govuk-tag--grey')
  })
})
