import { buildPayload } from './build-payload.js'
import { microserviceTemplatesFixture } from '../../../../__fixtures__/micro-service-templates.js'

describe('build-payload', () => {
  test('Should create a valid payload for a backend template', () => {
    const payload = buildPayload({
      serviceTemplates: microserviceTemplatesFixture,
      create: {
        kind: 'microservice',
        isComplete: { stepOne: true, stepTwo: true },
        microserviceName: 'foo',
        serviceTypeTemplateId: 'cdp-node-backend-template',
        teamId: 'platform',
        templateTag: '',
        teamName: 'Platform',
        serviceTypeName: 'Node.js Backend'
      }
    })

    expect(payload).toEqual({
      repositoryName: 'foo',
      teamId: 'platform',
      serviceTypeTemplate: 'cdp-node-backend-template'
    })
  })

  test('Should create a valid payload for a backend template when overriding the branch', () => {
    const payload = buildPayload({
      serviceTemplates: microserviceTemplatesFixture,
      create: {
        kind: 'microservice',
        isComplete: { stepOne: true, stepTwo: true },
        microserviceName: 'foo',
        serviceTypeTemplateId: 'cdp-node-backend-template',
        teamId: 'platform',
        templateTag: 'my-branch',
        teamName: 'Platform',
        serviceTypeName: 'Node.js Backend'
      }
    })

    expect(payload).toEqual({
      repositoryName: 'foo',
      teamId: 'platform',
      serviceTypeTemplate: 'cdp-node-backend-template',
      templateTag: 'my-branch'
    })
  })

  test('Should provide the correct id for cdp-node-backend-minimal', () => {
    const payload = buildPayload({
      serviceTemplates: microserviceTemplatesFixture,
      create: {
        kind: 'microservice',
        isComplete: { stepOne: true, stepTwo: true },
        microserviceName: 'foo',
        serviceTypeTemplateId: 'cdp-node-backend-template-minimal',
        teamId: 'platform',
        templateTag: '',
        teamName: 'Platform',
        serviceTypeName: 'Node.js Backend'
      }
    })

    expect(payload).toEqual({
      repositoryName: 'foo',
      teamId: 'platform',
      serviceTypeTemplate: 'cdp-node-backend-template-minimal',
      templateTag: 'minimal'
    })
  })
})
