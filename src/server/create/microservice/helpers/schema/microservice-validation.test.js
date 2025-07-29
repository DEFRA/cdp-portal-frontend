import { microserviceValidation } from './microservice-validation.js'
import { checkNameAvailability } from '../../../helpers/validator/check-name-availability.js'

vi.mock('../../../helpers/validator/check-name-availability')

describe('#microserviceValidation', () => {
  const templateIds = ['aTemplateid']

  test('Should validate as expected', async () => {
    const microserviceName = 'microservice-name'
    checkNameAvailability.mockResolvedValue(microserviceName)

    const request = {
      microserviceName,
      serviceTypeTemplateId: 'aTemplateid',
      teamId: 'team-id',
      templateTag: 'template-tag',
      redirectionLocation: 'summary'
    }
    const result =
      await microserviceValidation(templateIds).validateAsync(request)
    expect(result).toEqual(request)
  })

  test('Should error with name that starts with hyphen', async () => {
    const request = {
      microserviceName: '-microservice-name',
      serviceTypeTemplateId: 'aTemplateid',
      teamId: 'team-id',
      templateTag: 'template-tag',
      redirectionLocation: 'summary'
    }
    await expect(
      microserviceValidation(templateIds).validateAsync(request)
    ).rejects.toThrow('Start and end with a letter or number')
  })

  test('Should error with name that ends with hyphen', async () => {
    const request = {
      microserviceName: 'microservice-name-',
      serviceTypeTemplateId: 'aTemplateid',
      teamId: 'team-id',
      templateTag: 'template-tag',
      redirectionLocation: 'summary'
    }
    await expect(
      microserviceValidation(templateIds).validateAsync(request)
    ).rejects.toThrow('Start and end with a letter or number')
  })

  test('Should error with name that is longer than 32 characters', async () => {
    const request = {
      microserviceName: 'microservice-name-that-is-very-very-long',
      serviceTypeTemplateId: 'aTemplateid',
      teamId: 'team-id',
      templateTag: 'template-tag',
      redirectionLocation: 'summary'
    }
    await expect(
      microserviceValidation(templateIds).validateAsync(request)
    ).rejects.toThrow('32 characters or less')
  })

  test('Should error with name that ends with -ddl', async () => {
    const request = {
      microserviceName: 'microservice-name-ddl',
      serviceTypeTemplateId: 'aTemplateid',
      teamId: 'team-id',
      templateTag: 'template-tag',
      redirectionLocation: 'summary'
    }
    await expect(
      microserviceValidation(templateIds).validateAsync(request)
    ).rejects.toThrow('Must not end with "-ddl"')
  })
})
