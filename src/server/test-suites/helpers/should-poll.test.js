import { describe, expect, test } from 'vitest'
import { shouldPoll } from './should-poll.js'
import { taskStatus } from '../constants/test-run-status.js'

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
