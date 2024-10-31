import { taskStatus } from '~/src/server/test-suites/constants/test-run-status.js'

function shouldPoll(testRuns) {
  const completeValues = [taskStatus.failed, taskStatus.finished]

  return !testRuns.every((run) => {
    const taskStatusLwr = run?.taskStatus?.toLowerCase()

    return completeValues.includes(taskStatusLwr)
  })
}

export { shouldPoll }
