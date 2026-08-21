import { commonServiceExtensions } from '#server/common/helpers/ext/extensions.js'
import { scopes } from '@defra/cdp-validation-kit'
import { getFileUrl } from '../../files/BucketService.js'

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

  const url = await getFileUrl(request, path)

  return h.redirect(url)
}
