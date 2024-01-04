import nock from 'nock'

import { config } from '~/src/config'
import { checkNameAvailability } from '~/src/server/create/helpers/validator/check-name-availability'
import { repositoryFixture } from '~/src/__fixtures__/repository'
import { inProgressServiceStatusFixture } from '~/src/__fixtures__/in-progress-service-status'

describe('#checkNameAvailability', () => {
  const repositoryName = 'cdp-portal-frontend'
  const repositoryEndpointUrl = new URL(
    config.get('portalBackendApiUrl') + `/repositories/${repositoryName}`
  )
  const inProgressStatusEndpointUrl = new URL(
    config.get('selfServiceOpsApiUrl') + `/status/in-progress/${repositoryName}`
  )
  let mockHelpers

  beforeEach(() => {
    mockHelpers = {
      message: jest.fn().mockReturnValue('mock-message-helper-return')
    }
  })

  test('Should provide expected is available response', async () => {
    nock(repositoryEndpointUrl.origin)
      .get(repositoryEndpointUrl.pathname)
      .reply(404, { message: 'Not Found' })

    nock(inProgressStatusEndpointUrl.origin)
      .get(inProgressStatusEndpointUrl.pathname)
      .reply(404, { message: 'Not Found' })

    const response = await checkNameAvailability(repositoryName, mockHelpers)

    expect(response).toEqual(repositoryName)
  })

  test('Should provide not available response', async () => {
    nock(repositoryEndpointUrl.origin)
      .get(repositoryEndpointUrl.pathname)
      .reply(200, repositoryFixture)

    nock(inProgressStatusEndpointUrl.origin)
      .get(inProgressStatusEndpointUrl.pathname)
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

    nock(inProgressStatusEndpointUrl.origin)
      .get(inProgressStatusEndpointUrl.pathname)
      .reply(200, inProgressServiceStatusFixture)

    const response = await checkNameAvailability(repositoryName, mockHelpers)

    expect(mockHelpers.message).toHaveBeenCalledWith({
      external: 'Name is already being used'
    })
    expect(response).toEqual('mock-message-helper-return')
  })
})
