import nock from 'nock'

import { config } from '~/src/config'
import { checkNameAvailability } from '~/src/server/create/helpers/validator/check-name-availability'
import { repositoryFixture } from '~/src/__fixtures__/repository'
import { createServiceStatusFixture } from '~/src/__fixtures__/create-service-status'

describe('#checkNameAvailability', () => {
  const mockHelpers = {
    message: jest.fn().mockReturnValue('mock-message-helper-return')
  }
  const repositoryName = 'cdp-portal-frontend'
  const repositoryEndpointUrl = new URL(
    config.get('portalBackendApiUrl') + `/repositories/${repositoryName}`
  )
  const statusEndpointUrl = new URL(
    config.get('selfServiceOpsApiUrl') + `/status/${repositoryName}`
  )

  test('Should provide expected is available response', async () => {
    nock(repositoryEndpointUrl.origin)
      .get(repositoryEndpointUrl.pathname)
      .reply(404, { message: 'Not Found' })

    nock(statusEndpointUrl.origin)
      .get(statusEndpointUrl.pathname)
      .reply(404, { message: 'Not Found' })

    const response = await checkNameAvailability(repositoryName, mockHelpers)

    expect(response).toEqual(repositoryName)
  })

  test('Should provide not available response', async () => {
    nock(repositoryEndpointUrl.origin)
      .get(repositoryEndpointUrl.pathname)
      .reply(200, repositoryFixture)

    nock(statusEndpointUrl.origin)
      .get(statusEndpointUrl.pathname)
      .reply(404, { message: 'Not Found' })

    const response = await checkNameAvailability(repositoryName, mockHelpers)

    expect(mockHelpers.message).toHaveBeenCalledWith({
      external: 'Name is already being used'
    })
    expect(response).toEqual('mock-message-helper-return')
  })

  test('Should provide not available response', async () => {
    nock(repositoryEndpointUrl.origin)
      .get(repositoryEndpointUrl.pathname)
      .reply(200, repositoryFixture)

    nock(statusEndpointUrl.origin)
      .get(statusEndpointUrl.pathname)
      .reply(200, createServiceStatusFixture)

    const response = await checkNameAvailability(repositoryName, mockHelpers)

    expect(mockHelpers.message).toHaveBeenCalledWith({
      external: 'Name is already being used'
    })
    expect(response).toEqual('mock-message-helper-return')
  })
})
