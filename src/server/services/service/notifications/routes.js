import {
  commonServiceExtensions,
  provideNotFoundIfPrototypeExtension
} from '#server/common/helpers/ext/extensions.js'
import { provideFormContextValues } from '#server/common/helpers/form/provide-form-context-values.js'
import { serviceOwnerOrAdminUserScope } from '#server/common/constants/scopes.js'
import { makeNotificationControllers } from '#server/common/helpers/notifications/make-notification-controllers.js'
import { servicesNotificationConfig } from '#server/common/helpers/notifications/notification-config.js'

const {
  list,
  listRefresh,
  create,
  remove,
  postRemove,
  update,
  updateRefresh,
  postUpdate,
  testNotification,
  postTestNotification
} = makeNotificationControllers(servicesNotificationConfig)

const serviceNotifications = {
  plugin: {
    name: 'serviceNotifications',
    register: (server) => {
      server.ext([
        ...commonServiceExtensions,
        provideNotFoundIfPrototypeExtension,
        {
          type: 'onPostHandler',
          method: provideFormContextValues(),
          options: {
            before: ['yar'],
            sandbox: 'plugin'
          }
        }
      ])

      server.route(
        [
          {
            method: 'GET',
            path: '/services/{serviceId}/notifications',
            ...list
          },
          {
            method: 'POST',
            path: '/services/{serviceId}/notifications',
            ...listRefresh
          },
          {
            method: 'POST',
            path: '/services/{serviceId}/notifications/create',
            ...create
          },
          {
            method: 'GET',
            path: '/services/{serviceId}/notifications/{notificationId}/remove',
            ...remove
          },
          {
            method: 'POST',
            path: '/services/{serviceId}/notifications/{notificationId}/remove',
            ...postRemove
          },
          {
            method: 'GET',
            path: '/services/{serviceId}/notifications/{notificationId}/update',
            ...update
          },
          {
            method: 'POST',
            path: '/services/{serviceId}/notifications/{notificationId}/update',
            ...updateRefresh
          },
          {
            method: 'POST',
            path: '/services/{serviceId}/notifications/{notificationId}/update/action',
            ...postUpdate
          },
          {
            method: 'GET',
            path: '/services/{serviceId}/notifications/{notificationId}/test',
            ...testNotification
          },
          {
            method: 'POST',
            path: '/services/{serviceId}/notifications/{notificationId}/test/action',
            ...postTestNotification
          }
        ].map(serviceOwnerOrAdminUserScope)
      )
    }
  }
}

export { serviceNotifications }
