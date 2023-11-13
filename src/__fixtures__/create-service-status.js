import { config } from '~/src/config'

const githubOrg = config.get('githubOrg')

//  Response from selfServiceOpsApi/create-service/status/cdp-portal-frontend
const createServiceStatusFixture = {
  message: 'success',
  status: {
    org: githubOrg,
    repositoryName: 'cdp-portal-frontend',
    portalVersion: 2,
    status: 'in-progress',
    started: '2023-10-27T12:37:46.915Z',
    serviceType: 'cdp-node-backend-template',
    teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474', // TODO confirm wih Argy the shape of the data for team
    teamName: 'Platform',
    zone: 'protected',
    createRepository: {
      status: 'success',
      url: `https://github.com/${githubOrg}/cdp-portal-frontend`,
      result: {} // TODO add in v2 result when available
    },
    'cdp-tf-svc-infra': {
      status: 'success',
      pr: {
        number: 309,
        sha: 'e8bdd73d9380f4417d9fc7701518e4c0d8ab6e67',
        ref: 'add-cdp-portal-frontend-to-tenant-services-1698410293717',
        html_url: `https://github.com/${githubOrg}/cdp-tf-svc-infra/pull/309`,
        node_id: 'PR_kwDOJVWcQM5d9_9_'
      },
      merged_sha: 'b622ed3e68d7ecab868d700fbe73b8696e7a39dc',
      main: {
        workflow: {
          name: 'Terraform Apply',
          id: 6667318902,
          html_url: `https://github.com/${githubOrg}/cdp-tf-svc-infra/actions/runs/6667318902`,
          created_at: '2023-10-27T12:40:27Z',
          updated_at: '2023-10-27T12:43:55Z',
          path: '.github/workflows/apply.yml'
        }
      }
    },
    'cdp-app-config': {
      status: 'success',
      pr: {
        number: 180,
        sha: 'ebb9ac9e250c7849ed79a5c9a1e1eef1a3b15d83',
        ref: 'add-cdp-portal-frontend-config-1698410297725',
        html_url: `https://github.com/${githubOrg}/cdp-app-config/pull/180`,
        node_id: 'PR_kwDOJ1mq8M5d9__U'
      },
      merged_sha: '1717bb6a43ad21fb12e4545e4194d7bb3fb4dcf7',
      main: {
        workflow: {
          name: 'Upload config to s3 (infra-dev)',
          id: 6667297592,
          html_url: `https://github.com/${githubOrg}/cdp-app-config/actions/runs/6667297592`,
          created_at: '2023-10-27T12:38:40Z',
          updated_at: '2023-10-27T12:39:14Z',
          path: '.github/workflows/infra-dev-update-config.yml'
        }
      }
    },
    'cdp-nginx-upstreams': {
      status: 'success',
      pr: {
        number: 123,
        sha: '40ad087c9195ee541318c760531ca33e586ecaee',
        ref: 'add-cdp-portal-frontend-config-1698410301096',
        html_url: `https://github.com/${githubOrg}/cdp-nginx-upstreams/pull/123`,
        node_id: 'PR_kwDOJxxeSs5d-AAl'
      },
      merged_sha: '2395d47bec5c9692c0d56bafbbc40d2533627ec6',
      main: {
        workflow: {
          name: 'Push to S3',
          id: 6667301828,
          html_url: `https://github.com/${githubOrg}/cdp-nginx-upstreams/actions/runs/6667301828`,
          created_at: '2023-10-27T12:39:01Z',
          updated_at: '2023-10-27T12:39:47Z',
          path: '.github/workflows/push.yml'
        }
      }
    }
  }
}

export { createServiceStatusFixture }
