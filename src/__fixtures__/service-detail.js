import { config } from '~/src/config'

const githubOrg = config.get('githubOrg')

// A service from portalBackendUrl/services/<serviceId>
// decorated with repository data from portalBackendUrl/repositories/<repositoryId>
const serviceDetailFixture = {
  serviceName: 'cdp-portal-deployables-backend',
  githubUrl: `https://github.com/${githubOrg}/cdp-deployables`,
  imageName: 'cdp-portal-deployables-backend',
  description:
    'Core delivery platform Deployables DotNet backend API. This Api collects metadata about deployable artifacts (Docker images) and provides this information to the Core Development Portal.',
  primaryLanguage: 'C#',
  isArchived: false,
  isTemplate: false,
  isPrivate: true,
  createdAt: '2023-04-05T08:56:52Z',
  teamName: 'Fish-and-octopus',
  teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
  teams: [
    {
      github: 'fisheries',
      teamId: '087d4a80-002b-48cf-a7d3-aa60b67784f0',
      name: 'Fish-and-octopus'
    }
  ],
  runningServices: [
    {
      deploymentId: 'D86E2991-5367-45D6-9D9C-51553C83973E',
      environment: 'Production',
      service: 'cdp-portal-deployables-backend',
      version: '0.2.0',
      user: 'TestUser',
      deployedAt: '2023-06-19T11:13:55Z',
      status: 'RUNNING',
      dockerImage:
        '111111111.dkr.ecr.us-west-2.amazonaws.com/cdp-deployables:0.2.0',
      taskId: '1E8CAF74-388D-426E-90E3-26BF8AE47B23'
    },
    {
      deploymentId: 'D86E2991-5367-45D6-9D9C-51553C83973E',
      environment: 'Development',
      service: 'cdp-portal-deployables-backend',
      version: '0.2.0',
      user: 'TestUser',
      deployedAt: '2023-06-19T11:13:55Z',
      status: 'RUNNING',
      dockerImage:
        '333333333.dkr.ecr.us-west-2.amazonaws.com/cdp-deployables:0.2.0',
      taskId: '9844B50E-A0C2-43A5-A784-7AE2BA375FCF'
    },
    {
      deploymentId: 'D86E2991-5367-45D6-9D9C-51553C83973E',
      environment: 'Testing',
      service: 'cdp-portal-deployables-backend',
      version: '0.2.0',
      user: 'TestUser',
      deployedAt: '2023-06-19T11:13:55Z',
      status: 'RUNNING',
      dockerImage:
        '444444444.dkr.ecr.us-west-2.amazonaws.com/cdp-deployables:0.2.0',
      taskId: '2872F7CC-699A-4E80-B27C-AFB6B4042D0C'
    },
    {
      deploymentId: 'D86E2991-5367-45D6-9D9C-51553C83973E',
      environment: 'PreProduction',
      service: 'cdp-portal-deployables-backend',
      version: '0.2.0',
      user: 'TestUser',
      deployedAt: '2023-06-19T11:13:55Z',
      status: 'RUNNING',
      dockerImage:
        '222222222.dkr.ecr.us-west-2.amazonaws.com/cdp-deployables:0.2.0',
      taskId: '3AE51963-758E-49CE-B535-0166EFAFC821'
    }
  ]
}

export { serviceDetailFixture }
