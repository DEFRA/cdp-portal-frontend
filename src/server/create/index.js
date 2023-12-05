import {
  chooseKindController,
  chooseKindFormController,
  startController,
  microserviceDetailController,
  microserviceDetailFormController,
  microserviceSummaryController,
  microserviceCreateController,
  repositoryDetailController,
  repositoryDetailFormController,
  repositorySummaryController,
  repositoryCreateController,
  repositorySuccessController
} from '~/src/server/create/controllers'
import { scopes } from '~/src/server/common/constants/scopes'
import { provideCreateSteps } from '~/src/server/create/helpers/form'
import { authScope } from '~/src/server/common/helpers/auth/auth-scope'
import { sessionNames } from '~/src/server/common/constants/session-names'
import { provideFormContextValues } from '~/src/server/common/helpers/form/provide-form-context-values'

const serviceTeamUserScope = authScope(`+${scopes.serviceTeamUser}`)

const create = {
  plugin: {
    name: 'create',
    register: (server) => {
      server.ext([
        {
          type: 'onPostHandler',
          method: provideFormContextValues(sessionNames.create),
          options: {
            before: ['yar'],
            sandbox: 'plugin'
          }
        },
        {
          type: 'onPostHandler',
          method: provideCreateSteps,
          options: {
            sandbox: 'plugin'
          }
        }
      ])

      server.route(
        [
          {
            method: 'GET',
            path: '/create',
            ...startController
          },
          {
            method: 'GET',
            path: '/create/choose-kind',
            ...chooseKindFormController
          },
          {
            method: 'POST',
            path: '/create/choose-kind',
            ...chooseKindController
          },
          {
            method: 'GET',
            path: '/create/microservice-detail',
            ...microserviceDetailFormController
          },
          {
            method: 'POST',
            path: '/create/microservice-detail',
            ...microserviceDetailController
          },
          {
            method: 'GET',
            path: '/create/microservice/summary',
            ...microserviceSummaryController
          },
          {
            method: 'POST',
            path: '/create/microservice',
            ...microserviceCreateController
          },
          {
            method: 'GET',
            path: '/create/repository-detail',
            ...repositoryDetailFormController
          },
          {
            method: 'POST',
            path: '/create/repository-detail',
            ...repositoryDetailController
          },
          {
            method: 'GET',
            path: '/create/repository/summary',
            ...repositorySummaryController
          },
          {
            method: 'POST',
            path: '/create/repository',
            ...repositoryCreateController
          },
          {
            method: 'GET',
            path: '/create/repository/success',
            ...repositorySuccessController
          }
        ].map(serviceTeamUserScope)
      )
    }
  }
}

export { create }
