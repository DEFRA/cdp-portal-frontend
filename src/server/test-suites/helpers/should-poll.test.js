import { shouldPoll } from '~/src/server/test-suites/helpers/should-poll'
import { taskStatus } from '~/src/server/test-suites/constants/test-run-status'

describe('#shouldPoll', () => {
  test('When complete, should not poll', () => {
    expect(
      shouldPoll([
        { taskStatus: taskStatus.finished },
        { taskStatus: taskStatus.failed }
      ])
    ).toBe(false)
  })

  test('When incomplete, should poll', () => {
    expect(
      shouldPoll([
        { taskStatus: taskStatus.inProgress },
        { taskStatus: taskStatus.finished },
        { taskStatus: taskStatus.failed }
      ])
    ).toBe(true)
  })
})
