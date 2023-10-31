import { statusTagClassMap } from '~/src/server/services/transformers/status-tag-class-map'
import { serviceCreationStatuses } from '~/src/server/common/constants/service-creation-statuses'

describe('#statusTagClassMap', () => {
  test('Should provide expected "raised" tag className', () => {
    expect(statusTagClassMap(serviceCreationStatuses.raised)).toEqual(
      'govuk-tag--purple'
    )
  })

  test('Should provide expected "in-progress" tag className', () => {
    expect(statusTagClassMap(serviceCreationStatuses.inProgress)).toEqual(
      'govuk-tag--blue'
    )
  })

  test('Should provide expected "not-requested" tag className', () => {
    expect(statusTagClassMap(serviceCreationStatuses.notRequested)).toEqual(
      'govuk-tag--grey'
    )
  })

  test('Should provide expected "success" tag className', () => {
    expect(statusTagClassMap(serviceCreationStatuses.success)).toEqual(
      'govuk-tag--green'
    )
  })

  test('Should provide expected "workflow_completed" tag className', () => {
    expect(
      statusTagClassMap(serviceCreationStatuses.workflowCompleted)
    ).toEqual('govuk-tag--green')
  })

  test('Should provide expected "failed" tag className', () => {
    expect(statusTagClassMap(serviceCreationStatuses.failed)).toEqual(
      'govuk-tag--red'
    )
  })

  test('Should provide expected "failure" tag className', () => {
    expect(statusTagClassMap(serviceCreationStatuses.failure)).toEqual(
      'govuk-tag--red'
    )
  })

  test('Should provide expected default tag className', () => {
    expect(statusTagClassMap('paddingtonBear')).toEqual('govuk-tag--grey')
  })
})