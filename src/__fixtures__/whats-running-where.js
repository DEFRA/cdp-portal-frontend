// Response from portalBackendApi/whats-running-where
const whatsRunningWhereFixture = [
  {
    deploymentId: '01863667-7AAF-4A69-84A0-E03C59858C62',
    environment: 'PreProduction',
    service: 'cdp-portal-frontend',
    version: '0.2.0',
    deployedAt: '2023-05-18T21:53:57Z',
    status: 'RUNNING',
    dockerImage: '222222222.dkr.ecr.us-west-2.amazonaws.com:0.2.0',
    user: 'B. A. Baracus',
    userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
    taskId: '4AE290C9-665F-4F3B-BE95-9B41098F3292'
  },
  {
    deploymentId: 'F1074CF6-8C80-49CE-B68E-6E3FEA4A5EA1',
    environment: 'Testing',
    service: 'cdp-portal-frontend',
    version: '0.2.0',
    deployedAt: '2023-05-18T21:53:57Z',
    status: 'RUNNING',
    dockerImage: '444444444.dkr.ecr.us-west-2.amazonaws.com:0.2.0',
    user: 'RoboCop',
    userId: '01b99595-27b5-4ab0-9807-f104c09d2cd0',
    taskId: 'F3407BBB-4E0C-4309-A551-BA723064417C'
  },
  {
    deploymentId: '83ADB1F0-D7B5-412D-82DB-3BDA149EDC01',
    environment: 'Production',
    service: 'cdp-portal-frontend',
    version: '0.2.0',
    deployedAt: '2023-05-18T21:53:57Z',
    status: 'RUNNING',
    dockerImage: '111111111.dkr.ecr.us-west-2.amazonaws.com:0.2.0',
    user: 'Mumm-ra',
    userId: '01b99595-27b5-4ab0-9807-f104c09d2cd0',
    taskId: '50A5E6EA-254C-4F3B-A7B9-3593E940B1CC'
  },
  {
    deploymentId: '553E4E6B-05D7-4A2E-BF80-02ED34DEF864',
    environment: 'Production',
    service: 'cdp-teams-and-repositories',
    version: '0.2.0',
    deployedAt: '2023-05-18T21:54:12Z',
    status: 'RUNNING',
    dockerImage:
      '111111111.dkr.ecr.us-west-2.amazonaws.com/cdp-teams-and-repositories:0.2.0',
    user: 'B. A. Baracus',
    userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
    taskId: 'A18FFC69-B226-40A3-A425-9869F09BB1F1'
  },
  {
    deploymentId: 'A80CF40C-5811-4145-8147-6332597167D9',
    environment: 'Development',
    service: 'cdp-portal-frontend',
    version: '0.2.0',
    deployedAt: '2023-05-18T21:53:57Z',
    status: 'RUNNING',
    dockerImage: '333333333.dkr.ecr.us-west-2.amazonaws.com:0.2.0',
    user: 'Mumm-ra',
    userId: '01b99595-27b5-4ab0-9807-f104c09d2cd0',
    taskId: 'EEF3AA75-66D8-4695-AE95-4FBFF84AFBC9'
  },
  {
    deploymentId: 'D921920A-0411-4727-9354-4D1B3B3925FD',
    environment: 'Development',
    service: 'cdp-teams-and-repositories',
    version: '0.2.0',
    deployedAt: '2023-05-18T21:54:12Z',
    status: 'RUNNING',
    dockerImage:
      '333333333.dkr.ecr.us-west-2.amazonaws.com/cdp-teams-and-repositories:0.2.0',
    user: 'RoboCop',
    userId: '01b99595-27b5-4ab0-9807-f104c09d2cd0',
    taskId: 'G3407BBB-4E0C-4309-A551-BA723064417D'
  },
  {
    deploymentId: '733E2ABD-5CA1-4F7B-BD6A-B49ADEE8DB21',
    environment: 'Testing',
    service: 'cdp-teams-and-repositories',
    version: '0.2.0',
    deployedAt: '2023-05-18T21:54:12Z',
    status: 'RUNNING',
    dockerImage:
      '444444444.dkr.ecr.us-west-2.amazonaws.com/cdp-teams-and-repositories:0.2.0',
    user: 'RoboCop',
    userId: '01b99595-27b5-4ab0-9807-f104c09d2cd0',
    taskId: 'U3407BBB-4E0C-4309-A551-BA723064417F'
  },
  {
    deploymentId: '6B163EB6-2444-4438-9C83-B85C9A8E4BC3',
    environment: 'PreProduction',
    service: 'cdp-teams-and-repositories',
    version: '0.2.0',
    deployedAt: '2023-05-18T21:54:12Z',
    status: 'RUNNING',
    dockerImage:
      '222222222.dkr.ecr.us-west-2.amazonaws.com/cdp-teams-and-repositories:0.2.0',
    user: 'RoboCop',
    userId: '01b99595-27b5-4ab0-9807-f104c09d2cd0',
    taskId: 'H3407BBB-4E0C-4309-A551-BA723064417S'
  }
]

export { whatsRunningWhereFixture }
