import { commonServiceExtensions } from '#server/common/helpers/ext/extensions.js'
import { scopes, statusCodes } from '@defra/cdp-validation-kit'
import { getFile, getFileUrl } from '../../files/BucketService.js'

export const ext = [...commonServiceExtensions]

export const options = {
  auth: {
    mode: 'required',
    access: {
      scope: [/* scopes.serviceOwner, */ scopes.admin] // TODO: Open to owners
    }
  }
}

export default async function (request, h) {
  const path = `/${request.params.path ?? ''}`

  // const s3File = await getFile(request, path)

  // return h
  //   .response(s3File.Body)
  //   .header('Content-Type', s3File.ContentType)
  //   .code(statusCodes.ok)
  //
  const url = await getFileUrl(request, path)

  return h.redirect(url)
}
