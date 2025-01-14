// Response from portalBackendApi/services/filters
const servicesFiltersFixture = {
  filters: {
    services: [
      'cdp-user-service-backend',
      'cdp-portal-frontend',
      'forms-designer'
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
    ]
  }
}

export { servicesFiltersFixture }
