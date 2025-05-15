// Response from portalBackendApi/deployments/filters

const deploymentsFiltersFixture = {
  filters: {
    services: [
      'cdp-example-node-postgres-be',
      'cdp-portal-frontend',
      'forms-designer',
      'cdp-user-service-backend'
    ],
    statuses: [
      'failed',
      'pending',
      'requested',
      'running',
      'stopped',
      'stopping',
      'SUCCEEDED',
      'undeployed'
    ],
    users: [
      {
        id: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
        displayName: 'B. A. Baracus'
      },
      {
        id: '01b99595-27b5-4ab0-9807-f104c09d2cd0',
        displayName: 'Mumm-ra'
      },
      {
        displayName: 'The Terminator',
        id: '0ddadf17-beaf-4aef-a415-ca044dbdd18d'
      }
    ],
    teams: [
      {
        github: 'forms',
        teamId: '0be2f4a1-3e1c-4675-a8ec-3af6d453b7ca',
        name: 'Forms'
      },
      {
        github: 'cdp-platform',
        teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
        name: 'Platform'
      }
    ],
    kinds: ['deployment', 'migration']
  }
}

export { deploymentsFiltersFixture }
