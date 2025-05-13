// Response from portalBackendApi/entities/cdp-bc-journey-test-suite
const testSuiteFixture = {
  name: 'cdp-bc-journey-test-suite',
  type: 'TestSuite',
  subType: 'Journey',
  primaryLanguage: null,
  created: '2016-12-05T11:21:25Z',
  creator: null,
  teams: [
    {
      teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
      name: 'Platform'
    }
  ],
  status: 'Success',
  decommissioned: null
}

// Response from portalBackendApi/entities/cdp-portal-frontend
const serviceFixture = {
  name: 'cdp-portal-frontend',
  type: 'Microservice',
  subType: 'Frontend',
  primaryLanguage: null,
  created: '2023-04-12T17:16:48Z',
  creator: null,
  teams: [
    {
      teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
      name: 'Platform'
    }
  ],
  status: 'Success',
  decommissioned: null
}

export { testSuiteFixture, serviceFixture }
