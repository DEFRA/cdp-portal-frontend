import { provideDeploymentStatusClassname } from '../../../running-services/helpers/provide-deployment-status-classname.js'

export const runningServiceEntityStyleguide = {
  name: 'running-service-entity',
  title: 'Running Service Entity',
  description: 'Compact running service status display for tables',
  category: 'data',
  macro: {
    path: 'running-service-entity/macro.njk',
    name: 'appRunningServiceEntity'
  },
  params: [
    {
      name: 'environment',
      type: 'string',
      required: true,
      description: 'Environment name for deployment link'
    },
    {
      name: 'service',
      type: 'string',
      required: true,
      description: 'Service name for GitHub link'
    },
    {
      name: 'version',
      type: 'string',
      required: true,
      description: 'Version number'
    },
    {
      name: 'status',
      type: 'string',
      required: true,
      description: 'Status: running, pending, requested, undeployed'
    },
    {
      name: 'statusClassname',
      type: 'string',
      required: false,
      description: 'CSS class for status styling'
    },
    {
      name: 'cdpDeploymentId',
      type: 'string',
      required: true,
      description: 'Deployment ID for linking'
    },
    {
      name: 'created',
      type: 'string',
      required: true,
      description: 'ISO timestamp of deployment'
    },
    {
      name: 'unstable',
      type: 'boolean',
      required: false,
      description: 'Whether the service is unstable'
    }
  ],
  examples: [
    {
      title: 'Running service entity',
      params: {
        environment: 'infra-dev',
        service: 'cdp-portal-frontend',
        version: '0.356.0',
        status: 'running',
        statusClassname: provideDeploymentStatusClassname('running'),
        cdpDeploymentId: '3c439dc3-014f-47ef-9433-57ef0a10d8aa',
        created: '2024-05-10T14:48:34.001Z'
      }
    }
  ]
}
