import { sortBy } from '../../../../common/helpers/sort/sort-by.js'
import { buildList } from '../../../../common/helpers/view/build-list.js'
import { sortByName } from '../../../../common/helpers/sort/sort-by-name.js'
import { renderComponent } from '../../../../common/helpers/nunjucks/render-component.js'

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

function resourceByEnvironment({ environment, environmentDetails }) {
  return {
    environment,
    s3BucketRows:
      environmentDetails?.s3Buckets
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
      environmentDetails?.sqsQueues
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
              'data-testid': `${prefix}-` + environment.toLowerCase()
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
      environmentDetails?.snsTopics
        ?.map(({ name, arn }) => ({ name, arn }))
        .toSorted(sortBy('name', 'asc'))
        .map(({ name, arn }, index) => {
          const prefix = 'sns-topic'
          const nameId = `${prefix}-name-${environment}-${index}`
          const arnId = `${prefix}-arn-${environment}-${index}`

          return {
            classes: 'app-summary-list app-summary-list--resource',
            attributes: {
              'data-testid': `${prefix}-` + environment.toLowerCase()
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
        }) ?? []
  }
}

function resourcesByEnvironment({ environments, tenantService }) {
  return environments.reduce((resources, environment) => {
    const environmentDetails = tenantService[environment]

    const environmentResources = resourceByEnvironment({
      environment,
      environmentDetails
    })

    return {
      ...resources,
      [environment]: environmentResources
    }
  }, {})
}

export { resourcesByEnvironment, resourceByEnvironment }
