import { sortBy } from '../../../../common/helpers/sort/sort-by.js'
import { buildList } from '../../../../common/helpers/view/build-list.js'
import { sortByName } from '../../../../common/helpers/sort/sort-by-name.js'
import { renderComponent } from '../../../../common/helpers/nunjucks/render-component.js'
import { noValue } from '../../../../common/constants/no-value.js'

const keyCellClass = 'app-summary-list__key'

const buildSubscriptionsList = (subscriptions) => {
  const topicsList = subscriptions.flatMap(({ topics }) => topics)

  return topicsList.map((topic, topicIndex) => ({
    key: {
      text: topicIndex === 0 ? 'Topic subs' : '',
      classes: keyCellClass
    },
    value: {
      html: buildList({
        items: [topic],
        classes: ['govuk-list--bullet govuk-!-margin-0']
      }),
      classes: 'app-summary-list__value'
    }
  }))
}

function resourceByEnvironment({
  environment,
  tenantServiceForEnv,
  tenantDatabaseForEnv
}) {
  return {
    environment,
    s3BucketRows:
      tenantServiceForEnv?.s3Buckets
        ?.map(({ url }) => url)
        .toSorted(sortByName)
        .map((url, index) => {
          const urlId = `s3-bucket-url-${environment}-${index}`
          return [
            {
              html: renderComponent('copy', {
                content: { id: urlId, text: url }
              })
            }
          ]
        }) ?? [],

    sqsQueues:
      tenantServiceForEnv?.sqsQueues
        ?.map(({ url, name, arn, subscriptions = [] }) => ({
          url,
          name,
          arn,
          subscriptions
        }))
        .toSorted(sortBy('name', 'asc'))
        .map(({ name, url, arn, subscriptions }, index) => {
          const prefix = 'sqs-queue'
          const nameId = `${prefix}-name-${environment}-${index}`
          const urlId = `${prefix}-url-${environment}-${index}`
          const arnId = `${prefix}-arn-${environment}-${index}`

          return {
            classes: 'app-summary-list app-summary-list--resource',
            attributes: {
              'data-testid': `${prefix}-${environment}`
            },
            rows: [
              {
                key: { text: 'Name', classes: keyCellClass },
                value: {
                  html: renderComponent('copy', {
                    content: { id: nameId, text: name }
                  })
                }
              },
              {
                key: { text: 'Url', classes: keyCellClass },
                value: {
                  html: renderComponent('copy', {
                    content: { id: urlId, text: url }
                  })
                }
              },
              {
                key: { text: 'Arn', classes: keyCellClass },
                value: {
                  html: renderComponent('copy', {
                    content: { id: arnId, text: arn }
                  })
                }
              },
              ...(subscriptions.length
                ? buildSubscriptionsList(subscriptions)
                : [])
            ]
          }
        }) ?? [],

    snsTopics:
      tenantServiceForEnv?.snsTopics
        ?.map(({ name, arn }) => ({ name, arn }))
        .toSorted(sortBy('name', 'asc'))
        .map(({ name, arn }, index) => {
          const prefix = 'sns-topic'
          const nameId = `${prefix}-name-${environment}-${index}`
          const arnId = `${prefix}-arn-${environment}-${index}`

          return {
            classes: 'app-summary-list app-summary-list--resource',
            attributes: {
              'data-testid': `${prefix}-${environment}`
            },
            rows: [
              {
                key: { text: 'Name', classes: keyCellClass },
                value: {
                  html: renderComponent('copy', {
                    content: { id: nameId, text: name }
                  })
                }
              },
              {
                key: { text: 'Arn', classes: keyCellClass },
                value: {
                  html: renderComponent('copy', {
                    content: { id: arnId, text: arn }
                  })
                }
              }
            ]
          }
        }) ?? [],

    database: tenantDatabaseForEnv
      ? {
          classes: 'app-summary-list app-summary-list--resource',
          attributes: {
            'data-testid': `database-${environment}`
          },
          rows: [
            {
              key: { text: 'Name', classes: keyCellClass },
              value: {
                html: tenantDatabaseForEnv.databaseName
                  ? renderComponent('copy', {
                      content: {
                        id: `database-name-${environment}`,
                        text: tenantDatabaseForEnv.databaseName
                      }
                    })
                  : noValue
              }
            },
            {
              key: { text: 'Endpoint', classes: keyCellClass },
              value: {
                html: tenantDatabaseForEnv.endpoint
                  ? renderComponent('copy', {
                      content: {
                        id: `database-endpoint-${environment}`,
                        text: tenantDatabaseForEnv.endpoint
                      }
                    })
                  : noValue
              }
            },
            {
              key: { text: 'Port', classes: keyCellClass },
              value: {
                html: tenantDatabaseForEnv.port
                  ? renderComponent('copy', {
                      content: {
                        id: `database-port-${environment}`,
                        text: tenantDatabaseForEnv.port
                      }
                    })
                  : noValue
              }
            }
          ]
        }
      : undefined
  }
}

function resourcesByEnvironment({
  environments,
  tenantService,
  tenantDatabase
}) {
  return environments.reduce((resources, environment) => {
    const tenantServiceForEnv = tenantService[environment]
    const tenantDatabaseForEnv = tenantDatabase?.[environment]

    const environmentResources = resourceByEnvironment({
      environment,
      tenantServiceForEnv,
      tenantDatabaseForEnv
    })

    return {
      ...resources,
      [environment]: environmentResources
    }
  }, {})
}

export { resourcesByEnvironment, resourceByEnvironment }
