import Bcrypt from 'bcrypt'

import { appConfig } from '~/src/config'

async function validateBasicAuth(request, username, password, h) {
  const user = appConfig.get('basicAuthUser')

  if (!user) {
    return { credentials: null, isValid: false }
  }

  const isValid = await Bcrypt.compare(
    password,
    appConfig.get('basicAuthPassword')
  )

  const credentials = { id: 'basicAuth', name: 'basicAuth' }

  return { credentials, isValid }
}

export { validateBasicAuth }
