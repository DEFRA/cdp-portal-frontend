const servicesFixture = [
  {
    serviceName: 'cdp-portal-frontend',
    githubUrl: 'https://github.com/DEFRA/cdp-portal-frontend',
    imageName: 'cdp-portal-frontend',
    description:
      'The Core Delivery Platform Portal. Gain insight on micro-services, deployments, running services and teams across the platform. While being able to create and control when and where you deploy micro-services. Everything you need and want to know about the Platform can be found here on the Portal.',
    primaryLanguage: 'JavaScript',
    isArchived: false,
    isTemplate: false,
    isPrivate: true,
    createdAt: '2023-04-12T17:16:48Z',
    id: 'cdp-portal-frontend',
    teams: ['forestry-management']
  },
  {
    serviceName: 'cdp-self-service-ops',
    githubUrl: 'https://github.com/DEFRA/cdp-self-service-ops',
    imageName: 'cdp-self-service-ops',
    description:
      'Core delivery platform Self Service Ops Node.js Backend.  This Api provides automation for service creation, deployment and future mutations sent from the Core Development Portal.',
    primaryLanguage: 'JavaScript',
    isArchived: false,
    isTemplate: false,
    isPrivate: true,
    createdAt: '2023-05-12T13:33:54Z',
    id: 'cdp-self-service-ops',
    teams: ['cdp-platform', 'fisheries']
  }
]

export { servicesFixture }
