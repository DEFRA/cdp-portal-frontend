// Response from portalBackendApi/test-run?name=cdp-portal-smoke-tests
const testSuiteRunsFixture = [
  {
    runId: '383547d8-f71c-4e7e-8b03-4ddf09fd84fe',
    testSuite: 'cdp-portal-smoke-tests',
    environment: 'infra-dev',
    cpu: 4096,
    memory: 8192,
    user: {
      id: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
      displayName: 'B. A. Baracus'
    },
    created: '2024-02-27T10:29:32.127Z',
    taskArn:
      'arn:aws:ecs:eu-west-2:123456789:task/infra-dev-ecs-public/f5cffc31e21149208f38b8ec2b168c50',
    taskStatus: 'in-progress',
    taskLastUpdated: '2024-02-27T10:31:36Z',
    testStatus: 'passed',
    tag: '0.2.0'
  },
  {
    runId: 'dc34cdaf-1f51-44cf-8c63-e9b6800d9609',
    testSuite: 'cdp-portal-smoke-tests',
    environment: 'infra-dev',
    cpu: 8192,
    memory: 16384,
    user: {
      id: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
      displayName: 'B. A. Baracus'
    },
    created: '2024-02-26T16:38:28.979Z',
    taskArn:
      'arn:aws:ecs:eu-west-2:123456789:task/infra-dev-ecs-public/7e4c74aa41e44a0399bef08711563715',
    taskStatus: 'finished',
    taskLastUpdated: '2024-02-26T16:40:34Z',
    testStatus: 'passed',
    tag: '0.1.0'
  }
]

export { testSuiteRunsFixture }
