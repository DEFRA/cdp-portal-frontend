import { commonServiceExtensions } from '#server/common/helpers/ext/extensions.js'
import { scopes } from '@defra/cdp-validation-kit'
import { completeMultipartUpload } from '../../../files/BucketService.js'

export const ext = [...commonServiceExtensions]

export const options = {
  auth: {
    mode: 'required',
    access: {
      scope: [/* scopes.serviceOwner, */ scopes.admin] // TODO: Open to owners
    }
  }
}

export async function PUT(request) {
  const { uploadId } = request.params

  const { path, uploadParts } = request.payload

  await completeMultipartUpload(request, path, uploadId, uploadParts)

  return { uploadId }
}
