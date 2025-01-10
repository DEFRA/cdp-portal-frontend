// Response from selfServiceOpsApi/status/filters?kind=microservice
const inProgressFiltersFixture = {
  message: 'success',
  filters: {
    services: ['new-service-two', 'new-service-one'],
    teams: [
      {
        teamId: '40c1e9af-e385-4a68-941f-177b276ca822',
        name: 'Animals'
      },
      {
        teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
        name: 'Platform'
      }
    ]
  }
}

export { inProgressFiltersFixture }
