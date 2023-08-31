import fetchMock from 'jest-fetch-mock'

import { availableVersionsFixture } from '~/src/__fixtures__/available-versions'
import { fetchVersions } from '~/src/client/common/helpers/fetchers/select/fetch-versions'

describe('#fetchVersions', () => {
  beforeEach(async () => {
    fetchMock.enableMocks()
  })

  afterEach(() => {
    fetchMock.disableMocks()
  })

  test('Should provide expected available versions response', async () => {
    fetch.mockResponse(() =>
      Promise.resolve(JSON.stringify(availableVersionsFixture))
    )

    const availableVersions = await fetchVersions('cdp-portal-frontend')

    expect(availableVersions).toEqual([
      {
        text: '0.87.0',
        value: '0.87.0'
      },
      {
        text: '0.86.0',
        value: '0.86.0'
      },
      {
        text: '0.85.0',
        value: '0.85.0'
      },
      {
        text: '0.84.0',
        value: '0.84.0'
      }
    ])
  })

  test('With error, Should throw with expected message', async () => {
    fetch.mockResponse(() =>
      Promise.reject(new Error('Something catastrophic has happened!'))
    )

    expect.assertions(2)

    try {
      await fetchVersions('cdp-self-service-ops')
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty(
        'message',
        'Something catastrophic has happened!'
      )
    }
  })
})
