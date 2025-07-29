// Response from portalBackendApi/running-services/filters
export const runningServicesFiltersFixture = {
  filters: {
    services: ['cdp-portal-frontend', 'cdp-user-service-backend'],
    statuses: ['pending', 'running', 'undeployed'],
    users: [
      {
        id: '01b99595-27b5-4ab0-9807-f104c09d2cd0',
        displayName: 'RoboCop'
      },
      {
        id: '7a34a7f1-55ca-4e6c-9fc6-56220c4280eb',
        displayName: 'Mumm-ra'
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
    kinds: null
  }
}
