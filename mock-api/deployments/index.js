const deployments = [
  {
    deploymentId: '1954D503-1016-4CC3-AD3E-26EF98B0B9D6',
    environment: 'snd',
    service: 'cdp-teams-and-repositories',
    version: '0.3.0',
    user: 'Barbie',
    createdAt: '2023-07-12T12:05:33Z',
    updatedAt: '2023-07-12T12:05:33Z',
    status: 'RUNNING',
    dockerImage:
      '111111111.dkr.ecr.us-west-2.amazonaws.com/cdp-teams-and-repositories:0.3.0',
    taskId: 'F9732281-D6A4-428F-B7FD-0171775A465D'
  },
  {
    deploymentId: '97DBF683-919B-4E12-B1C7-EF2EBA7516EB',
    environment: 'snd',
    service: 'cdp-portal-frontend',
    version: '0.2.0',
    user: 'Roger Rabbit',
    createdAt: '2023-07-12T11:01:28Z',
    updatedAt: '2023-07-12T11:01:28Z',
    status: 'RUNNING',
    dockerImage:
      '111111111.dkr.ecr.us-west-2.amazonaws.com/cdp-portal-frontend:0.2.0',
    taskId: '4A7C4DB9-93C5-4A02-B6D3-BE2B8A196C8C'
  },
  {
    deploymentId: '422696B3-B87D-4EB9-9F3C-0B5FBAC95ADC',
    environment: 'snd',
    service: 'cdp-self-service-ops',
    version: '0.2.0',
    user: 'RoboCop',
    createdAt: '2023-07-14T08:12:22Z',
    updatedAt: '2023-07-14T08:12:22Z',
    status: 'RUNNING',
    dockerImage:
      '111111111.dkr.ecr.us-west-2.amazonaws.com/cdp-self-service-ops:0.1.0',
    taskId: 'AB709A32-2448-463F-9023-AD53ABDFCB98'
  },
  {
    deploymentId: '97DBF683-919B-4E12-B1C7-EF2EBA7516EB',
    environment: 'snd',
    service: 'cdp-portal-frontend',
    version: '0.3.0',
    user: 'Darth Vader',
    createdAt: '2023-07-14T18:35:28Z',
    updatedAt: '2023-07-14T18:35:28Z',
    status: 'RUNNING',
    dockerImage:
      '111111111.dkr.ecr.us-west-2.amazonaws.com/cdp-portal-frontend:0.2.0',
    taskId: '4A7C4DB9-93C5-4A02-B6D3-BE2B8A196C8C'
  },
  {
    deploymentId: '1954D503-1016-4CC3-AD3E-26EF98B0B9D6',
    environment: 'snd',
    service: 'cdp-teams-and-repositories',
    version: '0.4.0',
    user: 'Tetsuo Shima',
    createdAt: '2023-07-30T15:43:33Z',
    updatedAt: '2023-07-30T15:43:33Z',
    status: 'RUNNING',
    dockerImage:
      '111111111.dkr.ecr.us-west-2.amazonaws.com/cdp-teams-and-repositories:0.3.0',
    taskId: 'F9732281-D6A4-428F-B7FD-0171775A465D'
  },
  {
    deploymentId: '97DBF683-919B-4E12-B1C7-EF2EBA7516EB',
    environment: 'snd',
    service: 'cdp-portal-frontend',
    version: '0.4.0',
    user: 'Roger Rabbit',
    createdAt: '2023-07-21T21:07:28Z',
    updatedAt: '2023-07-21T21:07:28Z',
    status: 'PENDING',
    dockerImage:
      '111111111.dkr.ecr.us-west-2.amazonaws.com/cdp-portal-frontend:0.2.0',
    taskId: '4A7C4DB9-93C5-4A02-B6D3-BE2B8A196C8C'
  },
  {
    deploymentId: '422696B3-B87D-4EB9-9F3C-0B5FBAC95ADC',
    environment: 'snd',
    service: 'cdp-self-service-ops',
    version: '0.4.0',
    user: 'RoboCop',
    createdAt: '2023-07-20T07:58:22Z',
    updatedAt: '2023-07-20T07:58:22Z',
    status: 'RUNNING',
    dockerImage:
      '111111111.dkr.ecr.us-west-2.amazonaws.com/cdp-self-service-ops:0.1.0',
    taskId: 'AB709A32-2448-463F-9023-AD53ABDFCB98'
  },
  {
    deploymentId: '97DBF683-919B-4E12-B1C7-EF2EBA7516EB',
    environment: 'snd',
    service: 'cdp-portal-frontend',
    version: '0.5.0',
    user: 'Darth Vader',
    createdAt: '2023-07-29T16:13:28Z',
    updatedAt: '2023-07-29T16:13:28Z',
    status: 'RUNNING',
    dockerImage:
      '111111111.dkr.ecr.us-west-2.amazonaws.com/cdp-portal-frontend:0.2.0',
    taskId: '4A7C4DB9-93C5-4A02-B6D3-BE2B8A196C8C'
  },
  {
    deploymentId: '422696B3-B87D-4EB9-9F3C-0B5FBAC95ADC',
    environment: 'snd',
    service: 'cdp-self-service-ops',
    version: '0.3.0',
    user: 'The Terminator',
    createdAt: '2023-07-19T22:10:22Z',
    updatedAt: '2023-07-19T22:10:22Z',
    status: 'FAILED',
    dockerImage:
      '111111111.dkr.ecr.us-west-2.amazonaws.com/cdp-self-service-ops:0.1.0',
    taskId: 'AB709A32-2448-463F-9023-AD53ABDFCB98'
  },
  {
    deploymentId: '1954D503-1016-4CC3-AD3E-26EF98B0B9D6',
    environment: 'snd',
    service: 'cdp-teams-and-repositories',
    version: '0.2.0',
    user: 'Jeff Banks',
    createdAt: '2023-06-07T17:05:33Z',
    updatedAt: '2023-06-07T17:05:33Z',
    status: 'RUNNING',
    dockerImage:
      '111111111.dkr.ecr.us-west-2.amazonaws.com/cdp-teams-and-repositories:0.3.0',
    taskId: 'F9732281-D6A4-428F-B7FD-0171775A465D'
  },
  {
    deploymentId: '1954D503-1016-4CC3-AD3E-26EF98B0B9D6',
    environment: 'snd',
    service: 'cdp-teams-and-repositories',
    version: '0.1.0',
    user: 'Queen Elizabeth',
    createdAt: '2023-05-07T11:34:33Z',
    updatedAt: '2023-05-07T11:34:33Z',
    status: 'RUNNING',
    dockerImage:
      '111111111.dkr.ecr.us-west-2.amazonaws.com/cdp-teams-and-repositories:0.3.0',
    taskId: 'F9732281-D6A4-428F-B7FD-0171775A465D'
  },
  {
    deploymentId: '97DBF683-919B-4E12-B1C7-EF2EBA7516EB',
    environment: 'snd',
    service: 'cdp-portal-frontend',
    version: '0.1.0',
    user: 'Indiana Jones',
    createdAt: '2023-06-21T16:08:28Z',
    updatedAt: '2023-06-21T16:08:28Z',
    status: 'RUNNING',
    dockerImage:
      '111111111.dkr.ecr.us-west-2.amazonaws.com/cdp-portal-frontend:0.2.0',
    taskId: '4A7C4DB9-93C5-4A02-B6D3-BE2B8A196C8C'
  },
  {
    deploymentId: '422696B3-B87D-4EB9-9F3C-0B5FBAC95ADC',
    environment: 'snd',
    service: 'cdp-self-service-ops',
    version: '0.1.0',
    user: 'RoboCop',
    createdAt: '2023-07-12T12:15:22Z',
    updatedAt: '2023-07-12T12:15:22Z',
    status: 'RUNNING',
    dockerImage:
      '111111111.dkr.ecr.us-west-2.amazonaws.com/cdp-self-service-ops:0.1.0',
    taskId: 'AB709A32-2448-463F-9023-AD53ABDFCB98'
  },
  {
    deploymentId: '41954D503-1016-4CC3-AD3E-26EF98B0B9D6',
    environment: 'management',
    service: 'cdp-teams-and-repositories',
    version: '0.3.0',
    user: 'Tetsuo Shima',
    createdAt: '2023-07-12T14:23:33Z',
    updatedAt: '2023-07-12T14:23:33Z',
    status: 'RUNNING',
    dockerImage:
      '111111111.dkr.ecr.us-west-2.amazonaws.com/cdp-teams-and-repositories:0.3.0',
    taskId: '4F9732281-D6A4-428F-B7FD-0171775A465D'
  },
  {
    deploymentId: '597DBF683-919B-4E12-B1C7-EF2EBA7516EB',
    environment: 'management',
    service: 'cdp-portal-frontend',
    version: '0.2.0',
    user: 'Roger Rabbit',
    createdAt: '2023-07-12T19:45:28Z',
    updatedAt: '2023-07-12T19:45:28Z',
    status: 'RUNNING',
    dockerImage:
      '111111111.dkr.ecr.us-west-2.amazonaws.com/cdp-portal-frontend:0.2.0',
    taskId: '54A7C4DB9-93C5-4A02-B6D3-BE2B8A196C8C'
  },
  {
    deploymentId: '6422696B3-B87D-4EB9-9F3C-0B5FBAC95ADC',
    environment: 'management',
    service: 'cdp-self-service-ops',
    version: '0.1.0',
    user: 'RoboCop',
    createdAt: '2023-07-12T11:37:22Z',
    updatedAt: '2023-07-12T11:37:22Z',
    status: 'FAILED',
    dockerImage:
      '111111111.dkr.ecr.us-west-2.amazonaws.com/cdp-self-service-ops:0.1.0',
    taskId: '6AB709A32-2448-463F-9023-AD53ABDFCB98'
  }
]

module.exports = { deployments }
