import { statusTagClassMap } from '~/src/server/common/helpers/status-tag-class-map'
import { creationStatuses } from '~/src/server/common/constants/creation-statuses'

describe('#statusTagClassMap', () => {
  test('Should provide expected "raised" tag className', () => {
    expect(statusTagClassMap(creationStatuses.raised)).toEqual(
      'govuk-tag--purple'
    )
  })

  test('Should provide expected "prOpen" tag className', () => {
    expect(statusTagClassMap(creationStatuses.raised)).toEqual(
      'govuk-tag--purple'
    )
  })

  test('Should provide expected "in-progress" tag className', () => {
    expect(statusTagClassMap(creationStatuses.inProgress)).toEqual(
      'govuk-tag--blue'
    )
  })

  test('Should provide expected "requested" tag className', () => {
    expect(statusTagClassMap(creationStatuses.requested)).toEqual(
      'govuk-tag--blue'
    )
  })

  test('Should provide expected "not-requested" tag className', () => {
    expect(statusTagClassMap(creationStatuses.notRequested)).toEqual(
      'govuk-tag--grey'
    )
  })

  test('Should provide expected "success" tag className', () => {
    expect(statusTagClassMap(creationStatuses.success)).toEqual(
      'govuk-tag--green'
    )
  })

  test('Should provide expected "created" tag className', () => {
    expect(statusTagClassMap(creationStatuses.created)).toEqual(
      'govuk-tag--green'
    )
  })

  test('Should provide expected "workflow_completed" tag className', () => {
    expect(statusTagClassMap(creationStatuses.workflowCompleted)).toEqual(
      'govuk-tag--green'
    )
  })

  test('Should provide expected "failure" tag className', () => {
    expect(statusTagClassMap(creationStatuses.failure)).toEqual(
      'govuk-tag--red'
    )
  })

  test('Should provide expected "unknown" tag className', () => {
    expect(statusTagClassMap(creationStatuses.unknown)).toEqual(
      'govuk-tag--red'
    )
  })

  test('Should provide expected default tag className', () => {
    expect(statusTagClassMap('paddingtonBear')).toEqual('govuk-tag--grey')
  })
})
