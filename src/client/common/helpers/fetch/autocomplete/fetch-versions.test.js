import fetchMock from 'jest-fetch-mock'

import { availableVersionsFixture } from '~/src/__fixtures__/available-versions'
import { fetchVersions } from '~/src/client/common/helpers/fetch/autocomplete/fetch-versions'
import { getError, NoErrorThrownError } from '~/test-helpers/get-error'

describe('#fetchVersions', () => {
  beforeEach(() => {
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

    expect(availableVersions).toEqual(availableVersionsFixture)
  })

  test('With error, Should throw with expected message', async () => {
    fetch.mockResponse(() =>
      Promise.reject(new Error('Something catastrophic has happened!'))
    )

    const error = await getError(async () =>
      fetchVersions('cdp-self-service-ops')
    )

    expect(error).not.toBeInstanceOf(NoErrorThrownError)
    expect(error).toBeInstanceOf(Error)
    expect(error).toHaveProperty(
      'message',
      'Something catastrophic has happened!'
    )
  })
})
