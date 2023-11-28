import fetchMock from 'jest-fetch-mock'

import { fetchMemory } from '~/src/client/common/helpers/fetchers/select/fetch-memory'
import { ecsCpuToMemoryOptionsMapFixture } from '~/src/__fixtures__/deploy-service/ecs-cpu-to-memory-options-map'

describe('#fetchMemory', () => {
  beforeEach(() => {
    fetchMock.enableMocks()
  })

  afterEach(() => {
    fetchMock.disableMocks()
  })

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

    expect.assertions(2)

    try {
      await fetchMemory(1024)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty(
        'message',
        'Something terrible has happened!'
      )
    }
  })
})
