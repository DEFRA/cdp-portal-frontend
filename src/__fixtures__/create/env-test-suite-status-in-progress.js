import { config } from '~/src/config'

const githubOrg = config.get('githubOrg')

// In-progress create environment test suite status response from selfServiceOpsApi/status/cdp-env-test-suite
const creatEnvTestSuiteStatusInProgressFixture = {
  message: 'success',
  repositoryStatus: {
    kind: 'repository',
    org: githubOrg,
    repositoryName: 'cdp-env-test-suite',
    portalVersion: 2,
    status: 'in-progress',
    started: '2023-11-22T09:28:57.925Z',
    serviceTypeTemplate: 'cdp-node-env-test-suite-template',
    team: {
      teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
      name: 'Platform'
    },
    zone: 'public',
    createRepository: {
      status: 'in-progress',
      url: `https://github.com/${githubOrg}/cdp-env-test-suite`,
      result: {} // TODO add in v2 result when available
    },
    'cdp-tf-svc-infra': {
      status: 'in-progress',
      pr: {
        number: 309,
        sha: 'e8bdd73d9380f4417d9fc7701518e4c0d8ab6e67',
        ref: 'add-cdp-env-test-suite-to-tenant-services-1698410293717',
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
    }
  }
}

export { creatEnvTestSuiteStatusInProgressFixture }
