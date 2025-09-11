import { buildPayload } from './build-payload.js'

describe('build-payload', () => {
  const microserviceTemplates = [
    {
      repositoryName: 'cdp-node-backend-template',
      zone: 'protected',
      mongo: true,
      redis: false,
      templateName: 'Node.js Backend',
      language: 'node',
      type: 'backend',
      id: 'cdp-node-backend-template',
      entityType: 'Microservice',
      entitySubType: 'Backend'
    },
    {
      repositoryName: 'cdp-node-backend-template',
      zone: 'protected',
      mongo: false,
      redis: false,
      templateName: 'Node.js Backend - Minimal',
      language: 'node',
      type: 'backend',
      defaultBranch: 'minimal',
      id: 'cdp-node-backend-template-minimal',
      entityType: 'Microservice',
      entitySubType: 'Backend'
    }
  ]

  it('should create a valid payload for a backend template', async () => {
    const payload = buildPayload({
      serviceTemplates: microserviceTemplates,
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
      serviceTypeTemplate: 'cdp-node-backend-template',
      templateTag: ''
    })
  })

  it('should create a valid payload for a backend template when overriding the branch', async () => {
    const payload = buildPayload({
      serviceTemplates: microserviceTemplates,
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

  it('should provide the correct id for cdp-node-backend-minimal', async () => {
    const payload = buildPayload({
      serviceTemplates: microserviceTemplates,
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
