import { describe, expect, test } from 'vitest'
import nock from 'nock'

import { config } from '../../../../config/config.js'
import { availableVersionsFixture } from '../../../../__fixtures__/available-versions.js'
import { fetchAvailableVersions } from './fetch-available-versions.js'
import {
  getError,
  NoErrorThrownError
} from '../../../../../test-helpers/get-error.js'

describe('#fetchAvailableVersions', () => {
  const serviceName = 'cdp-portal-frontend'
  const deployablesVersionsEndpoint = new URL(
    config.get('portalBackendUrl') + `/deployables/${serviceName}`
  )

  test('Should provide expected available options response', async () => {
    nock(deployablesVersionsEndpoint.origin)
      .get(deployablesVersionsEndpoint.pathname)
      .reply(200, availableVersionsFixture)

    const availableVersions = await fetchAvailableVersions(serviceName)

    expect(availableVersions).toEqual(availableVersionsFixture)
  })

  test('Should filter out zero version', async () => {
    nock(deployablesVersionsEndpoint.origin)
      .get(deployablesVersionsEndpoint.pathname)
      .reply(200, [{ tag: '0.0.0' }, ...availableVersionsFixture])

    const availableVersions = await fetchAvailableVersions(serviceName)

    expect(availableVersions).toEqual(availableVersionsFixture)
  })

  test('With error, Should throw with expected message', async () => {
    nock(deployablesVersionsEndpoint.origin)
      .get(deployablesVersionsEndpoint.pathname)
      .replyWithError('Arghhhhhhhhhhhhhh!')

    const error = await getError(async () =>
      fetchAvailableVersions(serviceName)
    )

    expect(error).not.toBeInstanceOf(NoErrorThrownError)
    expect(error).toBeInstanceOf(Error)
    expect(error).toHaveProperty(
      'message',
      'Client request error: Arghhhhhhhhhhhhhh!'
    )
  })
})
