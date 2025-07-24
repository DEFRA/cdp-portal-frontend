import { describe, expect, test } from 'vitest'

import { availableVersionsFixture } from '../../../../../__fixtures__/available-versions.js'
import { fetchVersions } from './fetch-versions.js'
import {
  getError,
  NoErrorThrownError
} from '../../../../../../test-helpers/get-error.js'

describe('#fetchVersions', () => {
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
