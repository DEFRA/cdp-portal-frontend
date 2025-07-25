import { expect } from 'vitest'
import path from 'node:path'
import fs from 'node:fs'
import filenamify from 'filenamify'

expect.extend({
  async toMatchFile(received) {
    const state = expect.getState()
    const { testPath, currentTestName } = state

    if (!testPath || !currentTestName) {
      return {
        pass: false,
        message: () => 'toMatchFile can only be used inside a test context'
      }
    }

    if (!state.__matchFileCallCount) state.__matchFileCallCount = {}
    state.__matchFileCallCount[currentTestName] =
      (state.__matchFileCallCount[currentTestName] || 0) + 1
    const callNumber = state.__matchFileCallCount[currentTestName]

    const snapshotDir = path.join(path.dirname(testPath), '__file_snapshots__')
    const escapedTestName = filenamify(currentTestName, {
      replacement: '-',
      maxLength: 104
    })
      .replace(/\s/g, '-')
      .replace(/-+/g, '-')

    const snapshotFile = path.join(
      snapshotDir,
      `${escapedTestName}-${callNumber}.html`
    )

    if (!fs.existsSync(snapshotDir)) {
      fs.mkdirSync(snapshotDir, { recursive: true })
    }

    try {
      await expect(
        received.replace(/\/public/g, '/.public')
      ).toMatchFileSnapshot(snapshotFile)
      return {
        pass: true,
        message: () => 'Matched snapshot'
      }
    } catch (err) {
      return {
        pass: false,
        message: () =>
          `${err.message} Inspect your code changes or run \`npm test -- -u\` to update them.` ||
          'Did not match snapshot'
      }
    }
  }
})
