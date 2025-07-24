import { describe, expect, test } from 'vitest'

import { fetchMemory } from './fetch-memory.js'
import { ecsCpuToMemoryOptionsMapFixture } from '../../../../../__fixtures__/deploy-service/ecs-cpu-to-memory-options-map.js'
import {
  getError,
  NoErrorThrownError
} from '../../../../../../test-helpers/get-error.js'

describe('#fetchMemory', () => {
  test('Should provide expected available memory response', async () => {
    fetch.mockResponse(() =>
      Promise.resolve(JSON.stringify(ecsCpuToMemoryOptionsMapFixture[512]))
    )

    const availableMemory = await fetchMemory(512)

    expect(availableMemory).toEqual(ecsCpuToMemoryOptionsMapFixture[512])
  })

  test('With error, Should throw with expected message', async () => {
    fetch.mockResponse(() =>
      Promise.reject(new Error('Something terrible has happened!'))
    )

    const error = await getError(async () => fetchMemory(1024))

    expect(error).not.toBeInstanceOf(NoErrorThrownError)
    expect(error).toBeInstanceOf(Error)
    expect(error).toHaveProperty('message', 'Something terrible has happened!')
  })
})
