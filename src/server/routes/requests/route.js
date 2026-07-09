import { scopes } from "@defra/cdp-validation-kit";

export const options = {
  auth: {
    mode: 'required',
    access: {
      scope: [scopes.admin] // TODO: open to tenants
    }
  }
}

export default async function (request) {
  const pendingResourceRequests = await Promise.resolve([
    {
      requestedAt: '2026-07-09T08:43:26.793Z',
      requestedBy: {
        id: '',
        displayName: 'David Beale'
      },
      workflow: {
        workflow_run_id: 123,
        run_url: '',
        html_url: 'https://github.com/workflow'
      },
      pullRequest: { url: 'https://github.com/pr' },
      resources: {
        s3_buckets: [],
        sqs_queues: [],
        sns_topics: [],
        sqs_sns_subscriptions: []
      }
    }
  ])

  // TODO: resolve teams here or in the BE
  // const cdpUser = await fetchCdpUser(userSession.id)

  return {
    pendingResourceRequests,
    breadcrumbs: [
      {
        text: 'Requests'
      }
    ]
  }
}
