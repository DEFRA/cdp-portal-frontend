import { commonServiceExtensions } from '#server/common/helpers/ext/extensions.js'
import { scopes } from '@defra/cdp-validation-kit'
import { listPathContents } from '../BucketService.js'

const byteValueNumberFormatter = Intl.NumberFormat('en', {
  notation: 'compact',
  style: 'unit',
  unit: 'byte',
  unitDisplay: 'narrow'
})

export const ext = [...commonServiceExtensions]

export const options = {
  id: 'services/{serviceId}/files',
  auth: {
    mode: 'required',
    access: {
      scope: [/* scopes.serviceOwner, */ scopes.admin] // TODO: Open to owners
    }
  }
}

export default async function (request, h) {
  const { path = '/' } = request.params
  const entity = request.app.entity

  const folderContents = await listPathContents(request, path)


  const relativePathParts = [...path.split('/').filter((seg) => seg !== '')]

  // rows: [
  //   [ { html: "<span style='display: flex; gap: 5px;'>" + appOpenFolderIcon({ classes: "app-icon--small" }) + "<a href='/'>..</a>" + "</span>" }, { text: '- - -' }, { text: '2026-07-08:13:42:42' }, { html: '<a class="app-link app-link--underline" href="/">New Folder</a>'} ],
  //   [ { html: "<span style='display: flex; gap: 5px;'>" + appFolderIcon({ classes: "app-icon--small" }) + "<a href='/'>batch-one</a>" + "</span>"}, { text: '- - -' }, { text: '2026-07-08:13:42:42' }, { html: '<a class="app-link app-link--underline" href="/">Rename</a>&nbsp;&nbsp;<a class="app-link app-link--underline" href="/">Move</a>&nbsp;&nbsp;<a class="app-link app-link--underline" href="/">Delete</a>' } ],
  //   [ { html: "<span style='display: flex; gap: 5px;'>" + appFileIcon({ classes: "app-icon--small" }) + "my-file.json" + "</span>" }, { text: '12.5K' }, { text: '2026-07-08:13:42:42' }, { html: '<a class="app-link app-link--underline" href="/">Download</a>&nbsp;&nbsp;<a class="app-link app-link--underline" href="/">Rename</a>&nbsp;&nbsp;<a class="app-link app-link--underline" href="/">Move</a>&nbsp;&nbsp;<a class="app-link app-link--underline" href="/">Delete</a>' } ]
  // ]

  return {
    entity,
    relativePathParts,
    folderContents,
    sizeFormat: byteValueNumberFormatter.format,
    breadcrumbs: [
      {
        text: 'Services',
        href: '/services'
      },
      {
        text: entity.name,
        href: `/services/${entity.name}`
      },
      {
        text: 'Files',
        href: path === '' ? undefined : `/services/${entity.name}/files`
      },
      ...buildFsBreadcrumbs(entity, relativePathParts)
    ]
  }
}

function buildFsBreadcrumbs(entity, relativePathParts) {
  return relativePathParts.map((path) => ({
    text: path,
    href: `/services/${entity.name}/files/${relativePathParts.join('/')}`
  }))
}
