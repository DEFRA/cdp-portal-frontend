import { commonServiceExtensions } from '#server/common/helpers/ext/extensions.js'
import { scopes } from '@defra/cdp-validation-kit'
import Boom from '@hapi/boom'
import { join, sep } from 'node:path/posix'
import { listPathContents } from '../BucketService.js'

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
  const { path = '' } = request.params
  const entity = request.app.entity

  const serviceBasePath = '' // join('/uploads', entity.name) // TODO: Use actual S3 path
  const fsPath = join(serviceBasePath, path, sep)

  // Protect against path traversal attack
  if (!fsPath.startsWith(serviceBasePath)) {
    return Boom.boomify(Boom.badRequest('Invalid path'))
  }

  const contents = await listPathContents(request, fsPath)

  console.log(fsPath)
  console.log(contents)

  const contentsRows = contents.map((obj) => [
    {
      html: obj.isFolder ? `<a href="${obj.path}">${obj.name}</a>` : obj.name
    },
    {
      text: obj.size
    },
    {
      text: obj.modifiedDate
    },
    {
      html: ''
    }
  ])

  const relativePathParts = [
    '/',
    ...fsPath
      .replace(serviceBasePath, '')
      .split('/')
      .filter((seg) => seg !== '')
  ]

  console.log(relativePathParts)


  // rows: [
  //   [ { html: "<span style='display: flex; gap: 5px;'>" + appOpenFolderIcon({ classes: "app-icon--small" }) + "<a href='/'>..</a>" + "</span>" }, { text: '- - -' }, { text: '2026-07-08:13:42:42' }, { html: '<a class="app-link app-link--underline" href="/">New Folder</a>'} ],
  //   [ { html: "<span style='display: flex; gap: 5px;'>" + appFolderIcon({ classes: "app-icon--small" }) + "<a href='/'>batch-one</a>" + "</span>"}, { text: '- - -' }, { text: '2026-07-08:13:42:42' }, { html: '<a class="app-link app-link--underline" href="/">Rename</a>&nbsp;&nbsp;<a class="app-link app-link--underline" href="/">Move</a>&nbsp;&nbsp;<a class="app-link app-link--underline" href="/">Delete</a>' } ],
  //   [ { html: "<span style='display: flex; gap: 5px;'>" + appFileIcon({ classes: "app-icon--small" }) + "my-file.json" + "</span>" }, { text: '12.5K' }, { text: '2026-07-08:13:42:42' }, { html: '<a class="app-link app-link--underline" href="/">Download</a>&nbsp;&nbsp;<a class="app-link app-link--underline" href="/">Rename</a>&nbsp;&nbsp;<a class="app-link app-link--underline" href="/">Move</a>&nbsp;&nbsp;<a class="app-link app-link--underline" href="/">Delete</a>' } ]
  // ]

  return {
    entity,
    relativePathParts,
    contentsRows,
    breadcrumbs: [
      {
        text: 'Services',
        href: '/services'
      },
      {
        text: entity.name,
        href: `/services/${entity.name}`
      },
      ...buildFsBreadcrumbs(entity, relativePathParts)
    ]
  }
}

function buildFsBreadcrumbs(entity, relativePathParts) {
  return relativePathParts.map((path) => ({
    text: path === '/' ? 'Files' : path,
    href: `/services/${entity.name}${relativePathParts.join('/')}`
  }))
}
