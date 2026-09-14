import { commonServiceExtensions } from '#server/common/helpers/ext/extensions.js'
import { scopes } from '@defra/cdp-validation-kit'
import {
  completeMultipartUpload,
  getFileUrl,
  getMultipartUploadPartUrl,
  startMultipartUpload
} from '../../imports/BucketService.js'
import { Boom } from '@hapi/boom'
import { parse } from '@hapi/subtext'

export const ext = [...commonServiceExtensions]

export const options = {
  auth: {
    mode: 'required',
    access: {
      scope: [/* scopes.serviceOwner, */ scopes.admin] // TODO: Open to owners
    }
  }
}

export async function GET(request, h) {
  const { path = '/' } = request.params
  const entity = request.app.entity
  const isFolder = path.endsWith('/')

  if (isFolder) {
    return Boom.notFound('Folders are not downloadable')
  }

  const url = await getFileUrl(request, entity.name, path)

  request.logger.info(`Proxying GET to ${url}`)
  return h.proxy({
    uri: url,
    redirects: 10
  })
}

export async function POST(request) {
  const { path = '/' } = request.params
  const entity = request.app.entity
  const isFolder = path.endsWith('/')

  if (isFolder) {
    // TOTO: createFolder()
    return Boom.notFound('TODO')
  }

  const { size } = request.payload
  const response = await startMultipartUpload(request, entity.name, path, size)

  return response
}

export async function PUT(request, h) {
  const { path = '/' } = request.params
  const entity = request.app.entity
  const { uploadId, partNumber, contentMd5 } = request.query

  if (uploadId && partNumber && contentMd5) {
    const url = await getMultipartUploadPartUrl(
      request,
      entity.name,
      path,
      uploadId,
      partNumber,
      contentMd5
    )

    request.logger.info(`Proxying PUT to ${url}`)
    return h.proxy({
      redirects: 10,
      mapUri(request) {
        return {
          uri: url,
          headers: {
            'content-type': 'application/octet-stream',
            'content-length': request.headers['content-length'],
            'content-md5': contentMd5
          }
        }
      }
    })
  }

  const { payload } = await parse(request.raw.req, null, {
    parse: true,
    output: 'data'
  })
  const { uploadParts } = payload
  await completeMultipartUpload(
    request,
    entity.name,
    path,
    uploadId,
    uploadParts
  )

  return {
    uploadId
  }
}

PUT.options = {
  payload: {
    maxBytes: 100 * 1024 * 1024,
    output: 'stream',
    parse: false
  }
}
