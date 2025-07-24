import { describe, expect, test } from 'vitest'
import nock from 'nock'

import { config } from '../../../../config/config.js'
import { fetchDeployServiceOptions } from './fetch-deploy-service-options.js'
import { deployServiceOptionsFixture } from '../../../../__fixtures__/deploy-service/deploy-service-options.js'
import {
  getError,
  NoErrorThrownError
} from '../../../../../test-helpers/get-error.js'

describe('#fetchDeployServiceOptions', () => {
  const deployServiceOptionsEndpoint = new URL(
    config.get('selfServiceOpsUrl') + '/deploy-service/options'
  )

  test('Should provide expected deploy service options response', async () => {
    nock(deployServiceOptionsEndpoint.origin)
      .get(deployServiceOptionsEndpoint.pathname)
      .reply(200, deployServiceOptionsFixture)

    const deployableImageNames = await fetchDeployServiceOptions()

    expect(deployableImageNames).toEqual(deployServiceOptionsFixture)
  })

  test('With error, Should throw with expected message', async () => {
    nock(deployServiceOptionsEndpoint.origin)
      .get(deployServiceOptionsEndpoint.pathname)
      .replyWithError('Huston we have a problem!')

    const error = await getError(fetchDeployServiceOptions)

    expect(error).not.toBeInstanceOf(NoErrorThrownError)
    expect(error).toBeInstanceOf(Error)
    expect(error).toHaveProperty(
      'message',
      'Client request error: Huston we have a problem!'
    )
  })
})
