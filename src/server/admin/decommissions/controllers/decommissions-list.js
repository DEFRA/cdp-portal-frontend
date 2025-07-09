import { fetchDecommissions } from '~/src/server/admin/decommissions/helpers/fetchers.js'

const decommissionsListController = {
  handler: async (request, h) => {
    const decommissions = await fetchDecommissions(request)

    // TODO add more details when we have them
    const rows = decommissions.map((decommission) => ({
      cells: [
        {
          headers: 'value',
          entity: {
            kind: 'link',
            url: `/admin/decommissions/${decommission.repositoryName}`,
            value: decommission.repositoryName
          }
        }
      ]
    }))

    return h.view('admin/decommissions/views/decommissions-list', {
      pageTitle: 'Decommissions',
      tableData: {
        headers: [{ id: 'value', text: 'Value', width: '100' }],
        rows,
        noResult: 'No decommissions found'
      }
    })
  }
}

export { decommissionsListController }
