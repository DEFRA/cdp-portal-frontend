import { commonServiceExtensions } from '#server/common/helpers/ext/extensions.js'
import { scopes } from '@defra/cdp-validation-kit'
import { getFilePutUrl } from '../../imports/BucketService.js'

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
  const { path, uploadId, uploadPartNumber } = request.payload

  const url = await getFilePutUrl(request, path, uploadId, uploadPartNumber)

  return { url }
}
