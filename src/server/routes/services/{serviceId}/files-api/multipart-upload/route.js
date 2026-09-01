import { commonServiceExtensions } from '#server/common/helpers/ext/extensions.js'
import { scopes } from '@defra/cdp-validation-kit'
import { startMultipartUpload } from '../../files/BucketService.js'

export const ext = [...commonServiceExtensions]

export const options = {
  auth: {
    mode: 'required',
    access: {
      scope: [/* scopes.serviceOwner, */ scopes.admin] // TODO: Open to owners
    }
  }
}

export async function POST(request) {
  const { path } = request.payload

  const uploadId = await startMultipartUpload(request, path)

  return { uploadId }
}
