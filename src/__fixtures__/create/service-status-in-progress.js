import { config } from '~/src/config'

const githubOrg = config.get('githubOrg')

// In-progress create service status response from selfServiceOpsApi/status/cdp-portal-frontend
const createServiceStatusInProgressFixture = {
  message: 'success',
  repositoryStatus: {
    kind: 'repository',
    org: githubOrg,
    repositoryName: 'cdp-portal-frontend',
    portalVersion: 2,
    status: 'in-progress',
    started: '2023-10-27T12:37:46.915Z',
    serviceTypeTemplate: 'cdp-node-backend-template',
    team: {
      teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
      name: 'Platform'
    },
    zone: 'protected',
    'cdp-create-workflows': {
      status: 'success',
      main: {
        workflow: {
          name: 'cdp-portal-frontend',
          id: 6667318902,
          html_url: `https://github.com/${githubOrg}/cdp-create-flows/actions/runs/6667318902`,
          created_at: '2023-10-27T12:40:27Z',
          updated_at: '2023-10-27T12:43:55Z',
          path: '.github/workflows/create-service.yml'
        }
      }
    },
    'cdp-tf-svc-infra': {
      status: 'in-progress',
      main: {
        workflow: {
          name: 'cdp-portal-frontend',
          id: 6667318902,
          html_url: `https://github.com/${githubOrg}/cdp-tf-svc-infra/actions/runs/6667318902`,
          created_at: '2023-10-27T12:40:27Z',
          updated_at: '2023-10-27T12:43:55Z',
          path: '.github/workflows/apply.yml'
        }
      }
    },
    'cdp-app-config': {
      status: 'in-progress',
      main: {
        workflow: {
          name: 'cdp-portal-frontend',
          id: 6667297592,
          html_url: `https://github.com/${githubOrg}/cdp-app-config/actions/runs/6667297592`,
          created_at: '2023-10-27T12:38:40Z',
          updated_at: '2023-10-27T12:39:14Z',
          path: '.github/workflows/infra-dev-update-config.yml'
        }
      }
    },
    'cdp-nginx-upstreams': {
      status: 'in-progress',
      main: {
        workflow: {
          name: 'cdp-portal-frontend',
          id: 6667301828,
          html_url: `https://github.com/${githubOrg}/cdp-nginx-upstreams/actions/runs/6667301828`,
          created_at: '2023-10-27T12:39:01Z',
          updated_at: '2023-10-27T12:39:47Z',
          path: '.github/workflows/push.yml'
        }
      }
    },
    'cdp-squid-proxy': {
      status: 'in-progress',
      main: {
        workflow: {
          name: 'cdp-portal-frontend',
          id: null,
          html_url: 'http://localhost:3939/#local-stub',
          created_at: '2024-07-09T13:07:05.842Z',
          updated_at: '2024-07-09T13:07:05.842Z',
          path: null
        }
      }
    },
    'cdp-grafana-svc': {
      status: 'in-progress',
      main: {
        workflow: {
          name: 'cdp-portal-frontend',
          id: null,
          html_url: 'http://localhost:3939/#local-stub',
          created_at: '2024-07-09T13:07:05.842Z',
          updated_at: '2024-07-09T13:07:05.842Z',
          path: null
        }
      }
    }
  }
}

export { createServiceStatusInProgressFixture }
