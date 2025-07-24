import { allSecretsController } from '../../../common/patterns/entities/tabs/secrets/controllers/all.js'
import { environmentSecretsController } from '../../../common/patterns/entities/tabs/secrets/controllers/environment.js'
import { updateSecretController } from '../../../common/patterns/entities/tabs/secrets/controllers/update.js'
import { createSecretController } from '../../../common/patterns/entities/tabs/secrets/controllers/create.js'
import { updateSecretFormController } from '../../../common/patterns/entities/tabs/secrets/controllers/update-form.js'
import { provideServiceTabs } from '../../helpers/provide-service-tabs.js'
import { provideFormContextValues } from '../../../common/helpers/form/provide-form-context-values.js'
import { commonServiceExtensions } from '../../../common/helpers/extensions.js'
import { serviceOwnerOrAdminUserScope } from '../../../common/constants/scopes.js'
import { provideSubNav } from '../../../helpers/provide-sub-navigation.js'
import { SERVICE } from '../../../common/patterns/entities/tabs/constants.js'

const serviceSecrets = {
  plugin: {
    name: 'serviceSecrets',
    register: (server) => {
      server.ext([
        ...commonServiceExtensions,
        {
          type: 'onPostHandler',
          method: provideFormContextValues(),
          options: {
            before: ['yar'],
            sandbox: 'plugin'
          }
        },
        // TODO can these postHandlers be combined?
        {
          type: 'onPostHandler',
          method: provideServiceTabs,
          options: {
            sandbox: 'plugin'
          }
        },
        {
          type: 'onPostHandler',
          method: provideSubNav('secrets', SERVICE),
          options: {
            sandbox: 'plugin'
          }
        }
      ])

      server.route(
        [
          {
            method: 'GET',
            path: '/services/{serviceId}/secrets',
            ...allSecretsController(SERVICE)
          },
          {
            method: 'GET',
            path: '/services/{serviceId}/secrets/{environment}',
            ...environmentSecretsController(SERVICE)
          },
          {
            method: 'GET',
            path: '/services/{serviceId}/secrets/{environment}/update',
            ...updateSecretFormController(SERVICE)
          },
          {
            method: 'POST',
            path: '/services/{serviceId}/secrets/{environment}/update',
            ...updateSecretController(SERVICE)
          },
          {
            method: 'POST',
            path: '/services/{serviceId}/secrets/{environment}/create',
            ...createSecretController(SERVICE)
          }
        ].map(serviceOwnerOrAdminUserScope)
      )
    }
  }
}

export { serviceSecrets }
