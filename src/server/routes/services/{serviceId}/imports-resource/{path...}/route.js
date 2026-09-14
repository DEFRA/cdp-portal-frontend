import { commonServiceExtensions } from '#server/common/helpers/ext/extensions.js'
import { scopes } from '@defra/cdp-validation-kit'
import {
  getFileUrl,
  getMultipartUploadPartUrl,
  startMultipartUpload
} from '../../imports/BucketService.js'
import { Boom } from '@hapi/boom'

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
  const isFolder = path.endsWith('/')

  if (isFolder) {
    return Boom.notFound('Folders are not downloadable')
  }

  const url = await getFileUrl(request, path)

  return h.proxy({
    uri: url
  })
}

export async function POST(request) {
  const { path = '/' } = request.params
  const isFolder = path.endsWith('/')

  if (isFolder) {
    // TOTO: createFolder()
    return Boom.notFound('Folders are not downloadable')
  }

  const { size } = request.payload
  const response = await startMultipartUpload(request, path, size)

  return response
}

export async function PUT(request, h) {
  const { path = '/', uploadId, partNumber, contentMd5 } = request.params

  if (uploadId && partNumber && contentMd5) {
    const url = await getMultipartUploadPartUrl(
      request,
      path,
      uploadId,
      partNumber,
      contentMd5
    )

    return h.proxy({
      uri: url
    })
  }

  // const { uploadId } = request.params
  // const { path, uploadParts } = request.payload
  // await completeMultipartUpload(request, path, uploadId, uploadParts)
  // return { uploadId }
}
