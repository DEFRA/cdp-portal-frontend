const deployedServices = [
  {
    id: '14be9663-e19b-4dd1-b606-8fa1a5094ba5',
    triggeredByUserId: 'Ben Chidgey',
    serviceName: 'FFC Grants Cattle Housing Web',
    version: '0.32.0',
    targetEnvironment: 'production',
    deploymentStatus: 'Deployed',
    timestamp: '2023-04-14T14:40:02.242Z'
  },
  {
    id: '24be9663-e19b-4dd1-b606-8fa1a5094ba5',
    triggeredByUserId: 'Ben Chidgey',
    serviceName: 'FFC Grants Cattle Housing Web',
    version: '0.27.1',
    targetEnvironment: 'perf test',
    deploymentStatus: 'Failed',
    timestamp: '2023-04-11T12:23:09.242Z'
  },
  {
    id: '34be9663-e19b-4dd1-b606-8fa1a5094ba5',
    triggeredByUserId: 'Ben Chidgey',
    serviceName: 'FFC Grants Cattle Housing Web',
    version: '0.28.0',
    targetEnvironment: 'development',
    deploymentStatus: 'Deployed',
    timestamp: '2023-04-11T11:37:01.242Z'
  },
  {
    id: '44be9663-e19b-4dd1-b606-8fa1a5094ba5',
    triggeredByUserId: 'Ben Chidgey',
    serviceName: 'FFC Grants Cattle Housing Web',
    version: '0.28.0',
    targetEnvironment: 'test',
    deploymentStatus: 'Deployed',
    timestamp: '2023-04-13T12:15:01.242Z'
  },
  {
    id: '14be9663-e19b-4dd1-b606-8fa1a5094ba6',
    triggeredByUserId: 'Christopher Turner',
    serviceName: 'Water Abstraction System',
    version: '0.1.0',
    targetEnvironment: 'development',
    deploymentStatus: 'Deployed',
    timestamp: '2023-04-11T15:11:31.722Z'
  },
  {
    id: '14be9663-e19b-4dd1-b606-8fa1a5094ba7',
    triggeredByUserId: 'Phil Hargreaves',
    serviceName: 'Waste Exemptions Back Office',
    version: '3.7.1',
    targetEnvironment: 'development',
    deploymentStatus: 'Failed',
    timestamp: '2023-04-03T11:47:09.242Z'
  },
  {
    id: '24be9663-e19b-4dd1-b606-8fa1a5094ba7',
    triggeredByUserId: 'Phil Hargreaves',
    serviceName: 'Waste Exemptions Back Office',
    version: '2.4.2',
    targetEnvironment: 'test',
    deploymentStatus: 'Deployed',
    timestamp: '2023-04-03T09:42:09.242Z'
  },
  {
    id: '34be9663-e19b-4dd1-b606-8fa1a5094ba7',
    triggeredByUserId: 'Phil Hargreaves',
    serviceName: 'Waste Exemptions Back Office',
    version: '3.8.0',
    targetEnvironment: 'perf test',
    deploymentStatus: 'Pending',
    timestamp: '2023-04-12T14:29:09.242Z'
  },
  {
    id: '44be9663-e19b-4dd1-b606-8fa1a5094ba7',
    triggeredByUserId: 'Phil Hargreaves',
    serviceName: 'Waste Exemptions Back Office',
    version: '3.6.0',
    targetEnvironment: 'production',
    deploymentStatus: 'Deployed',
    timestamp: '2023-04-21T17:14:09.242Z'
  },
  {
    id: '14be9663-e19b-4dd1-b606-8fa1a5094ba8',
    triggeredByUserId: 'Allen Fensome',
    serviceName: 'Rod Licensing',
    version: '0.7.0',
    targetEnvironment: 'test',
    deploymentStatus: 'Deployed',
    timestamp: '2023-04-10T13:47:45.722Z'
  },
  {
    id: '24be9663-e19b-4dd1-b606-8fa1a5094ba8',
    triggeredByUserId: 'Allen Fensome',
    serviceName: 'Rod Licensing',
    version: '0.7.0',
    targetEnvironment: 'development',
    deploymentStatus: 'Deployed',
    timestamp: '2023-03-09T11:03:45.722Z'
  },
  {
    id: '14be9663-e19b-4dd1-b606-8fa1a5094ba9',
    triggeredByUserId: 'Shelly Parker',
    serviceName: 'Pay Request Editor',
    version: '2.3.0',
    targetEnvironment: 'test',
    deploymentStatus: 'Failed',
    timestamp: '2023-04-07T08:49:34.722Z'
  },
  {
    id: '24be9663-e19b-4dd1-b606-8fa1a5094ba9',
    triggeredByUserId: 'Shelly Parker',
    serviceName: 'Pay Request Editor',
    version: '2.3.0',
    targetEnvironment: 'development',
    deploymentStatus: 'Deployed',
    timestamp: '2023-04-04T10:01:34.722Z'
  },
  {
    id: '34be9663-e19b-4dd1-b606-8fa1a5094ba9',
    triggeredByUserId: 'Shelly Parker',
    serviceName: 'Pay Request Editor',
    version: '2.2.0',
    targetEnvironment: 'perf test',
    deploymentStatus: 'Deployed',
    timestamp: '2023-03-02T15:45:34.722Z'
  },
  {
    id: '44be9663-e19b-4dd1-b606-8fa1a5094ba9',
    triggeredByUserId: 'Shelly Parker',
    serviceName: 'Pay Request Editor',
    version: '2.1.0',
    targetEnvironment: 'production',
    deploymentStatus: 'Deployed',
    timestamp: '2023-02-28T16:02:34.722Z'
  },
  {
    id: '14be9663-e19b-4dd1-b606-8fa1a5094ba0',
    triggeredByUserId: 'Gerald Marie-Nelly',
    serviceName: 'Waste Exemptions Back Office',
    version: '4.9.1',
    targetEnvironment: 'production',
    deploymentStatus: 'Deployed',
    timestamp: '2023-04-06T11:41:01.722Z'
  },
  {
    id: '24be9663-e19b-4dd1-b606-8fa1a5094ba0',
    triggeredByUserId: 'Gerald Marie-Nelly',
    serviceName: 'Waste Exemptions Back Office',
    version: '4.8.0',
    targetEnvironment: 'perf test',
    deploymentStatus: 'Deployed',
    timestamp: '2023-03-15T09:23:01.722Z'
  },
  {
    id: '34be9663-e19b-4dd1-b606-8fa1a5094ba0',
    triggeredByUserId: 'Gerald Marie-Nelly',
    serviceName: 'Waste Exemptions Back Office',
    version: '5.0.0',
    targetEnvironment: 'test',
    deploymentStatus: 'Failed',
    timestamp: '2023-04-14T12:04:01.722Z'
  },
  {
    id: '44be9663-e19b-4dd1-b606-8fa1a5094ba0',
    triggeredByUserId: 'Gerald Marie-Nelly',
    serviceName: 'Waste Exemptions Back Office',
    version: '5.0.1',
    targetEnvironment: 'development',
    deploymentStatus: 'Pending',
    timestamp: '2023-04-13T14:16:01.722Z'
  }
]

module.exports = { deployedServices }
