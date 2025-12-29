import { runningServicesFixture } from '../../../../__fixtures__/running-services/running-services.js'
import { provideDeploymentStatusClassname } from '../../../running-services/helpers/provide-deployment-status-classname.js'

export const runningServiceStyleguide = {
  name: 'running-service',
  title: 'Running Service',
  description: 'Running service status cards across environments',
  category: 'data',
  macro: {
    path: 'running-service/macro.njk',
    name: 'appRunningService'
  },
  params: [
    {
      name: 'environments',
      type: 'array',
      required: true,
      description: 'List of environment names to display'
    },
    {
      name: 'runningServices',
      type: 'array',
      required: true,
      description:
        'Array of running service objects with environment, service, version, status, statusClassname, instanceCount, cpu, memory, cdpDeploymentId, created, user, unstable'
    }
  ],
  examples: [
    {
      title: 'Running service',
      params: {
        environments: ['infra-dev', 'management'],
        runningServices: runningServicesFixture.map((rs) => ({
          ...rs,
          statusClassname: provideDeploymentStatusClassname(rs.status)
        }))
      }
    }
  ]
}
