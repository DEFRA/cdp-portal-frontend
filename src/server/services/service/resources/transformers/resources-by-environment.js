import { sortBy } from '../../../../common/helpers/sort/sort-by.js'
import { buildList } from '../../../../common/helpers/view/build-list.js'
import { sortByName } from '../../../../common/helpers/sort/sort-by-name.js'
import { renderComponent } from '../../../../common/helpers/nunjucks/render-component.js'
import { noValue } from '../../../../common/constants/no-value.js'

const keyClass = 'app-summary-list__key'

function resourceByEnvironment({
  environment,
  environmentDetails: {
    s3_buckets: s3Buckets,
    sqs_queues: sqsQueues,
    sns_topics: snsTopics,
    sql_database: sqlDatabase
  } = {}
}) {
  return {
    environment,
    s3BucketRows:
      s3Buckets
        ?.map(({ bucket_name: bucketName }) => `s3://${bucketName}`)
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
      sqsQueues
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
                key: { text: 'Name', classes: keyClass },
                value: {
                  html: renderComponent('copy', {
                    content: { id: nameId, text: name }
                  })
                }
              },
              {
                key: { text: 'Url', classes: keyClass },
                value: {
                  html: renderComponent('copy', {
                    content: { id: urlId, text: url }
                  })
                }
              },
              {
                key: { text: 'Arn', classes: keyClass },
                value: {
                  html: renderComponent('copy', {
                    content: { id: arnId, text: arn }
                  })
                }
              },
              ...(subscriptions.length
                ? [
                    {
                      key: {
                        text: 'Topic subs',
                        classes: keyClass
                      },
                      value: {
                        html: buildList({
                          items: subscriptions,
                          classes: ['govuk-list--bullet govuk-!-margin-0']
                        }),
                        classes: 'app-summary-list__value'
                      }
                    }
                  ]
                : [])
            ]
          }
        }) ?? [],

    snsTopics:
      snsTopics
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
                key: { text: 'Name', classes: keyClass },
                value: {
                  html: renderComponent('copy', {
                    content: { id: nameId, text: name }
                  })
                }
              },
              {
                key: { text: 'Arn', classes: keyClass },
                value: {
                  html: renderComponent('copy', {
                    content: { id: arnId, text: arn }
                  })
                }
              }
            ]
          }
        }) ?? [],

    database: sqlDatabase
      ? {
          classes: 'app-summary-list app-summary-list--resource',
          attributes: {
            'data-testid': `database-${environment}`
          },
          rows: [
            {
              key: { text: 'Name', classes: keyClass },
              value: {
                html: sqlDatabase.name
                  ? renderComponent('copy', {
                      content: {
                        id: `database-name-${environment}`,
                        text: sqlDatabase.name
                      }
                    })
                  : noValue
              }
            },
            {
              key: { text: 'Endpoint', classes: keyClass },
              value: {
                html: sqlDatabase.endpoint
                  ? renderComponent('copy', {
                      content: {
                        id: `database-endpoint-${environment}`,
                        text: sqlDatabase.endpoint
                      }
                    })
                  : noValue
              }
            },
            {
              key: { text: 'Port', classes: keyClass },
              value: {
                html: sqlDatabase.port
                  ? renderComponent('copy', {
                      content: {
                        id: `database-port-${environment}`,
                        text: sqlDatabase.port
                      }
                    })
                  : noValue
              }
            }
          ]
        }
      : null
  }
}

function resourcesByEnvironment({ environments, allEnvironmentsDetails }) {
  return Object.fromEntries(
    environments.map((environment) => {
      const environmentDetails = allEnvironmentsDetails[environment]

      return [
        environment,
        resourceByEnvironment({ environment, environmentDetails })
      ]
    })
  )
}

export { resourcesByEnvironment, resourceByEnvironment }
