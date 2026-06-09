import { sessionNames } from '#server/common/constants/session-names.js'
import formEngine from '#server/plugins/form-engine/form-engine.js'
import { scopes } from '@defra/cdp-validation-kit'
import Joi from 'joi'
import handleNoBasket from '../../../ext/handleNoBasket.js'
import provideLayoutContext from '../../../ext/provideLayoutContext.js'
import {
  getBasketResource,
  removeBasketResource
} from '../../../domain/basket.js'

export function register(routePath) {
  return [
    {
      plugin: formEngine,
      options: {
        route: {
          path: routePath,
          options: {
            auth: {
              mode: 'required',
              access: {
                scope: scopes.admin // TODO: Open to tenants
              }
            }
          }
        },

        ext: [handleNoBasket, provideLayoutContext('s3_bucket')],

        layout: 'routes/create/resources/detail/layouts/remove.njk',

        async schema(request) {
          const uuid = request.params.uuid
          const basket = request.yar.get(sessionNames.resourcesBasket)
          const resource = basket.s3_buckets[uuid]

          const userIsAdmin = await request.userIsAdmin()

          if (!userIsAdmin) {
            delete resource.environments
          }

          return Joi.object({
            summary: Joi.object().label('Resource details').default(resource)
          })
        },

        async load(request) {
          const uuid = request.params.uuid

          if (!uuid) return undefined

          const basket = request.yar.get(sessionNames.resourcesBasket)
          return getBasketResource(basket, 's3_buckets', uuid)
        },

        async actions(request, h) {
          const uuid = request.params.uuid

          return {
            submit: {
              text: 'Remove',
              classes: 'app-button--destructive',
              async method(request, h) {
                const basket = request.yar.get(sessionNames.resourcesBasket)

                request.yar.set(
                  sessionNames.resourcesBasket,
                  removeBasketResource(basket, 's3_buckets', uuid)
                )

                await request.yar.commit(h)

                return h.redirect('/create/resources/detail/')
              }
            },
            cancel: {
              text: 'Cancel',
              url: '/create/resources/detail'
            }
          }
        }
      }
    }
  ]
}
