const cdpPortalFrontend = 'cdp-portal-frontend'
const cdpPortalBackend = 'cdp-portal-backend'
const itemDetailGreen = 'item-detail--green'
const createdISO = '2024-05-10T14:48:34.001Z'

export const entityTableStyleguide = {
  name: 'entity-table',
  title: 'Entity Table',
  description: 'Table for displaying entity data with pagination support',
  category: 'data',
  macro: {
    path: 'entity-table/macro.njk',
    name: 'appEntityTable'
  },
  params: [
    {
      name: 'headers',
      type: 'array',
      required: true,
      description:
        'Table header definitions with id, text, classes, width, verticalText, isLeftAligned'
    },
    {
      name: 'rows',
      type: 'array',
      required: true,
      description: 'Table row data with cells containing entity or text/html'
    },
    {
      name: 'noResult',
      type: 'string',
      required: false,
      description: 'Message when no results'
    },
    {
      name: 'classes',
      type: 'string',
      required: false,
      description: 'Additional CSS classes'
    },
    {
      name: 'isWide',
      type: 'boolean',
      required: false,
      description: 'Use wide table styling'
    },
    {
      name: 'isInverse',
      type: 'boolean',
      required: false,
      description: 'Use inverse (dark) styling'
    },
    {
      name: 'pagination',
      type: 'object',
      required: false,
      description: 'GOV.UK pagination component params'
    }
  ],
  examples: [
    {
      title: 'Basic table with cells',
      description:
        'Simple table with link and tag entities in cells. This is used in multiple places but is not the recommended pattern for large lists.',
      isInverse: true,
      params: {
        headers: [
          { id: 'name', text: 'Name' },
          { id: 'status', text: 'Status' }
        ],
        rows: [
          {
            cells: [
              {
                headers: 'name',
                entity: {
                  kind: 'link',
                  value: cdpPortalFrontend,
                  url: '/services/cdp-portal-frontend'
                }
              },
              {
                headers: 'status',
                entity: {
                  kind: 'tag',
                  value: 'Running',
                  classes: 'govuk-tag--green'
                }
              }
            ]
          },
          {
            cells: [
              {
                headers: 'name',
                entity: {
                  kind: 'link',
                  value: cdpPortalFrontend,
                  url: '/services/cdp-portal-frontend'
                }
              },
              {
                headers: 'status',
                entity: {
                  kind: 'tag',
                  value: 'Pending',
                  classes: 'govuk-tag--purple'
                }
              }
            ]
          }
        ],
        noResult: 'No services found'
      }
    },
    {
      title: 'With service row component',
      description:
        'This is the service row component. Using row components provides better performance for large lists. The caller pattern allows custom row rendering.',
      isInverse: true,
      template: `{% from "entity-table/macro.njk" import appEntityTable %}
{% from "services/common/components/service-row/macro.njk" import appEntityTableServiceRow %}

{% call(params) appEntityTable(tableData) %}
  {{ appEntityTableServiceRow({
    rowClasses: params.rowClasses,
    loopIndex: params.loopIndex,
    isOwner: params.row.isOwner,
    entityName: params.row.entityName,
    serviceTags: params.row.serviceTags,
    teams: params.row.teams,
    serviceType: params.row.serviceType,
    githubUrl: params.row.githubUrl,
    creationState: params.row.creationState
  }) | safe }}
{% endcall %}`,
      context: {
        tableData: {
          isWide: true,
          headers: [
            { id: 'owner', width: '2' },
            { id: 'service', text: 'Service', width: '22' },
            { id: 'team', text: 'Team', width: '12' },
            { id: 'type', text: 'Type', width: '8' },
            { id: 'github-url', text: 'GitHub' },
            { id: 'created', text: 'Created', width: '14' }
          ],
          rows: [
            {
              isOwner: true,
              entityName: cdpPortalFrontend,
              teams: [{ value: 'Platform', url: '/teams/platform' }],
              serviceType: 'Frontend',
              serviceTags: [
                { displayName: 'live', className: 'govuk-tag--green' }
              ],
              githubUrl: `https://github.com/DEFRA/${cdpPortalFrontend}`,
              creationState: { date: '2024-01-15T10:30:00Z' }
            },
            {
              isOwner: false,
              entityName: cdpPortalBackend,
              teams: [{ value: 'Platform', url: '/teams/platform' }],
              serviceType: 'Backend',
              serviceTags: [],
              githubUrl: `https://github.com/DEFRA/${cdpPortalBackend}`,
              creationState: {
                value: 'Creating',
                classes: 'govuk-tag--purple'
              }
            }
          ],
          noResult: 'No services found'
        }
      }
    },
    {
      title: 'With running service row component',
      description:
        'This is the Running services list using the row component pattern. Each row renders environment status cells.',
      isInverse: true,
      template: `{% from "entity-table/macro.njk" import appEntityTable %}
{% from "running-services/common/components/running-service-row/macro.njk" import appEntityTableRunningServiceRow %}

{% call(params) appEntityTable(tableData) %}
  {{ appEntityTableRunningServiceRow({
    rowClasses: params.rowClasses,
    loopIndex: params.loopIndex,
    isOwner: params.row.isOwner,
    serviceName: params.row.serviceName,
    serviceTeams: params.row.serviceTeams,
    serviceEnvironments: params.row.serviceEnvironments,
    allEnvironments: environments
  }) | safe }}
{% endcall %}`,
      context: {
        environments: ['infra-dev', 'dev', 'test', 'prod'],
        tableData: {
          isWide: true,
          headers: [
            { id: 'owner', width: '2' },
            { id: 'service', text: 'Service', width: '22' },
            { id: 'team', text: 'Team', width: '12' },
            {
              id: 'infra-dev',
              text: 'Infra-Dev',
              verticalText: true,
              isLeftAligned: true,
              width: '6'
            },
            {
              id: 'dev',
              text: 'Dev',
              verticalText: true,
              isLeftAligned: true,
              width: '6'
            },
            {
              id: 'test',
              text: 'Test',
              verticalText: true,
              isLeftAligned: true,
              width: '6'
            },
            {
              id: 'prod',
              text: 'Prod',
              verticalText: true,
              isLeftAligned: true,
              width: '6'
            }
          ],
          rows: [
            {
              isOwner: true,
              serviceName: cdpPortalFrontend,
              serviceTeams: [{ id: 'platform', name: 'Platform' }],
              serviceEnvironments: {
                'infra-dev': {
                  environment: 'infra-dev',
                  service: cdpPortalFrontend,
                  version: '0.356.0',
                  status: 'running',
                  statusClassname: itemDetailGreen,
                  cdpDeploymentId: 'abc123',
                  created: createdISO,
                  unstable: false
                },
                dev: {
                  environment: 'dev',
                  service: cdpPortalFrontend,
                  version: '0.355.0',
                  status: 'running',
                  statusClassname: itemDetailGreen,
                  cdpDeploymentId: 'abc123',
                  created: createdISO,
                  unstable: false
                },
                test: {
                  environment: 'test',
                  service: cdpPortalFrontend,
                  version: '0.355.0',
                  status: 'running',
                  statusClassname: itemDetailGreen,
                  cdpDeploymentId: 'abc123',
                  created: createdISO,
                  unstable: false
                }
              }
            },
            {
              isOwner: false,
              serviceName: cdpPortalBackend,
              serviceTeams: [{ id: 'platform', name: 'Platform' }],
              serviceEnvironments: {
                'infra-dev': {
                  environment: 'infra-dev',
                  service: cdpPortalBackend,
                  version: '0.149.0',
                  status: 'running',
                  statusClassname: itemDetailGreen,
                  cdpDeploymentId: 'def456',
                  created: '2024-07-23T23:03:55.79Z',
                  unstable: false
                },
                dev: {
                  environment: 'dev',
                  service: cdpPortalBackend,
                  version: '0.148.0',
                  status: 'pending',
                  statusClassname: 'item-detail--purple',
                  cdpDeploymentId: 'ghi789',
                  created: '2024-07-22T10:00:00Z',
                  unstable: false
                }
              }
            }
          ],
          noResult: 'No running services found'
        }
      }
    }
  ]
}
