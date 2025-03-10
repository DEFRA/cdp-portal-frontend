import { allSecretsController } from '~/src/server/services/secrets/controllers/all.js'
import { environmentSecretsController } from '~/src/server/services/secrets/controllers/environment.js'
import { updateSecretController } from '~/src/server/services/secrets/controllers/update.js'
import { createSecretController } from '~/src/server/services/secrets/controllers/create.js'
import { updateSecretFormController } from '~/src/server/services/secrets/controllers/update-form.js'
import { scopes } from '~/src/server/common/constants/scopes.js'
import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'

const serviceOwnerOrAdminUserScope = authScope([
  scopes.admin,
  scopes.serviceOwner
])

export const serviceSecrets = [
  {
    method: 'GET',
    path: '/services/{serviceId}/secrets',
    ...allSecretsController
  },
  {
    method: 'GET',
    path: '/services/{serviceId}/secrets/{environment}',
    ...environmentSecretsController
  },
  {
    method: 'GET',
    path: '/services/{serviceId}/secrets/{environment}/update',
    ...updateSecretFormController
  },
  {
    method: 'POST',
    path: '/services/{serviceId}/secrets/{environment}/update',
    ...updateSecretController
  },
  {
    method: 'POST',
    path: '/services/{serviceId}/secrets/{environment}/create',
    ...createSecretController
  }
].map(serviceOwnerOrAdminUserScope)
