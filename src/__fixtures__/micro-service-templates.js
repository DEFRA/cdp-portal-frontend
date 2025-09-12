const microserviceTemplatesFixture = [
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

export { microserviceTemplatesFixture }
