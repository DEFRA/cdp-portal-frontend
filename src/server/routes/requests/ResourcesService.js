import { config } from '#config/config.js'
import { fetchJson } from '#server/common/helpers/fetch/fetch-json.js'

export async function getPendingResourceRequests() {
  const endpoint = `${config.get('portalBackendUrl')}/resources/requests?status=requested&status=pending`

  // const { payload = {} } = await fetchJson(endpoint)

  return [
    {
      requestedAt: '2026-07-10T09:19:51.28Z',
      requestedBy: {
        id: '94f3387e-8ad7-4bbe-8a99-0f118a85240b',
        displayName: 'David Beale  (Defra)'
      },
      workflow: {
        workflow_run_id: 29082683001,
        run_url:
          'https://api.github.com/repos/DEFRA/cdp-tenant-config/actions/runs/29082683001',
        html_url:
          'https://github.com/DEFRA/cdp-tenant-config/actions/runs/29082683001'
      },
      pullRequest: {
        url: 'https://github.com/DEFRA/cdp-tenant-config/pull/1424',
        number: 1424
      },
      status: 'requested',
      teams: [{ teamId: 'platform', name: 'Platform' }]
    }
  ]
}
