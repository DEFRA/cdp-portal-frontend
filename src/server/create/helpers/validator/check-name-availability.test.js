import nock from 'nock'

import { config } from '~/src/config/config.js'
import { checkNameAvailability } from '~/src/server/create/helpers/validator/check-name-availability.js'
import { repositoryFixture } from '~/src/__fixtures__/repository.js'
import { entityServicesFixture } from '~/src/__fixtures__/services/entities.js'

describe('#checkNameAvailability', () => {
  const repositoryName = 'cdp-portal-frontend'
  const repositoryEndpointUrl = new URL(
    `${config.get('portalBackendUrl')}/repositories/${repositoryName}`
  )
  const fetchEntitiesEndpointUrl = new URL(
    `${config.get('portalBackendUrl')}/entities/${repositoryName}`
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

    nock(fetchEntitiesEndpointUrl.origin)
      .get(fetchEntitiesEndpointUrl.pathname)
      .reply(404, { message: 'Not Found' })

    const response = await checkNameAvailability(repositoryName, mockHelpers)

    expect(response).toEqual(repositoryName)
  })

  test('Should provide not available response', async () => {
    nock(repositoryEndpointUrl.origin)
      .get(repositoryEndpointUrl.pathname)
      .reply(200, repositoryFixture)

    nock(fetchEntitiesEndpointUrl.origin)
      .get(fetchEntitiesEndpointUrl.pathname)
      .reply(404, { message: 'Not Found' })

    const response = await checkNameAvailability(repositoryName, mockHelpers)

    expect(mockHelpers.message).toHaveBeenCalledWith({
      external: 'Name is already being used'
    })
    expect(response).toBe('mock-message-helper-return')
  })

  test('With matching in progress service name. Should provide not available response', async () => {
    nock(repositoryEndpointUrl.origin)
      .get(repositoryEndpointUrl.pathname)
      .reply(200, repositoryFixture)

    nock(fetchEntitiesEndpointUrl.origin)
      .get(fetchEntitiesEndpointUrl.pathname)
      .reply(200, entityServicesFixture[0])

    const response = await checkNameAvailability(repositoryName, mockHelpers)

    expect(mockHelpers.message).toHaveBeenCalledWith({
      external: 'Name is already being used'
    })
    expect(response).toBe('mock-message-helper-return')
  })
})
