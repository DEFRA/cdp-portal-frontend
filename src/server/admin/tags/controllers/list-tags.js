import { serviceTags } from '../helpers/service-tags.js'
import { transformTagToRow } from '../transformers/transform-tag-to-row.js'

const listTagsListController = {
  handler: (request, h) => {
    const rows = Object.values(serviceTags).map(transformTagToRow)

    return h.view('admin/tags/views/tags-list', {
      pageTitle: 'Tags',
      tableData: {
        headers: [
          { id: 'name', text: 'Name', width: '30' },
          { id: 'tag', text: 'Tag', width: '10' },
          { id: 'description', text: 'Description', width: '60' }
        ],
        rows,
        noResult: 'No tags found'
      }
    })
  }
}

export { listTagsListController }
