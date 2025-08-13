import {
  resourcesByEnvironment,
  resourceByEnvironment
} from './resources-by-environment.js'
import { tenantServicesFixture } from '../../../../../__fixtures__/tenant-services.js'

describe('#resourceByEnvironment', () => {
  test('Should return expected resources', () => {
    const result = resourceByEnvironment({
      environment: 'prod',
      environmentDetails: tenantServicesFixture.prod
    })

    expect(result).toEqual({
      environment: 'prod',
      s3BucketRows: [
        [
          {
            html: expect.stringContaining(
              's3://prod-cdp-portal-backend-c63f2-75ee2'
            )
          }
        ],
        [
          {
            html: expect.stringContaining(
              's3://prod-cdp-portal-backend-images-c63f2-75ee2'
            )
          }
        ]
      ],
      sqsQueues: [
        {
          classes: 'app-summary-list app-summary-list--resource',
          attributes: {
            'data-testid': 'sqs-queue-prod'
          },
          rows: [
            {
              key: {
                text: 'Name',
                classes: 'app-summary-list__key'
              },
              value: {
                html: expect.stringContaining('message_clearance_request')
              }
            },
            {
              key: {
                text: 'Url',
                classes: 'app-summary-list__key'
              },
              value: {
                html: expect.stringContaining(
                  'https://sqs.eu-west-2.amazonaws.com/111111111/message_clearance_request.fifo'
                )
              }
            },
            {
              key: {
                text: 'Arn',
                classes: 'app-summary-list__key'
              },
              value: {
                html: expect.stringContaining(
                  'arn:aws:sqs:eu-west-2:111111111:message_clearance_request.fifo'
                )
              }
            },
            {
              key: {
                text: 'Topic subs',
                classes: 'app-summary-list__key'
              },
              value: {
                html: expect.stringContaining('message_clearance_request.fifo'),
                classes: 'app-summary-list__value'
              }
            }
          ]
        },
        {
          classes: 'app-summary-list app-summary-list--resource',
          attributes: {
            'data-testid': 'sqs-queue-prod'
          },
          rows: [
            {
              key: {
                text: 'Name',
                classes: 'app-summary-list__key'
              },
              value: {
                html: expect.stringContaining('message_notification')
              }
            },
            {
              key: {
                text: 'Url',
                classes: 'app-summary-list__key'
              },
              value: {
                html: expect.stringContaining(
                  'https://sqs.eu-west-2.amazonaws.com/111111111/message_notification.fifo'
                )
              }
            },
            {
              key: {
                text: 'Arn',
                classes: 'app-summary-list__key'
              },
              value: {
                html: expect.stringContaining(
                  'arn:aws:sqs:eu-west-2:111111111:message_notification.fifo'
                )
              }
            },
            {
              key: {
                text: 'Topic subs',
                classes: 'app-summary-list__key'
              },
              value: {
                html: expect.stringContaining('decision_notification.fifo'),
                classes: 'app-summary-list__value'
              }
            }
          ]
        }
      ],
      snsTopics: [
        {
          classes: 'app-summary-list app-summary-list--resource',
          attributes: {
            'data-testid': 'sns-topic-prod'
          },
          rows: [
            {
              key: {
                text: 'Name',
                classes: 'app-summary-list__key'
              },
              value: {
                html: expect.stringContaining('decision_notification')
              }
            },
            {
              key: {
                text: 'Arn',
                classes: 'app-summary-list__key'
              },
              value: {
                html: expect.stringContaining(
                  'arn:aws:sns:eu-west-2:111111111:decision_notification.fifo'
                )
              }
            }
          ]
        },
        {
          classes: 'app-summary-list app-summary-list--resource',
          attributes: {
            'data-testid': 'sns-topic-prod'
          },
          rows: [
            {
              key: {
                text: 'Name',
                classes: 'app-summary-list__key'
              },
              value: {
                html: expect.stringContaining('error_notification')
              }
            },
            {
              key: {
                text: 'Arn',
                classes: 'app-summary-list__key'
              },
              value: {
                html: expect.stringContaining(
                  'arn:aws:sns:eu-west-2:111111111:error_notification.fifo'
                )
              }
            }
          ]
        }
      ]
    })
  })

  test('Should return empty arrays when environmentDetails is undefined', () => {
    const result = resourceByEnvironment({
      environment: 'dev',
      environmentDetails: undefined
    })
    expect(result).toEqual({
      environment: 'dev',
      s3BucketRows: [],
      sqsQueues: [],
      snsTopics: []
    })
  })

  test('Should return correct s3BucketRows with sorted urls', () => {
    const result = resourceByEnvironment({
      environment: 'prod',
      environmentDetails: {
        s3Buckets: [{ url: 'b-url' }, { url: 'a-url' }]
      }
    })
    expect(result.s3BucketRows.length).toBe(2)
    expect(result.s3BucketRows.at(0).at(0).html).toContain('a-url')
    expect(result.s3BucketRows.at(1).at(0).html).toContain('b-url')
  })

  test('Should return correct sqsQueues with sorted names', () => {
    const result = resourceByEnvironment({
      environment: 'test',
      environmentDetails: {
        sqsQueues: [
          { name: 'queueB', url: 'urlB', arn: 'arnB' },
          { name: 'queueA', url: 'urlA', arn: 'arnA' }
        ]
      }
    })
    expect(result.sqsQueues.length).toBe(2)
    expect(result.sqsQueues.at(0).rows.at(0).value.html).toContain('queueA')
    expect(result.sqsQueues.at(1).rows.at(0).value.html).toContain('queueB')
  })

  test('Should return correct snsTopics with sorted names', () => {
    const result = resourceByEnvironment({
      environment: 'stage',
      environmentDetails: {
        snsTopics: [
          { name: 'topicB', arn: 'arnB' },
          { name: 'topicA', arn: 'arnA' }
        ]
      }
    })
    expect(result.snsTopics.length).toBe(2)
    expect(result.snsTopics.at(0).rows.at(0).value.html).toContain('topicA')
    expect(result.snsTopics.at(1).rows.at(0).value.html).toContain('topicB')
  })
})

describe('#resourcesByEnvironment', () => {
  test('Should return resources for each environment', () => {
    const environments = ['dev', 'prod']
    const tenantService = {
      dev: { s3Buckets: [{ url: 'dev-url' }] },
      prod: { s3Buckets: [{ url: 'prod-url' }] }
    }
    const result = resourcesByEnvironment({ environments, tenantService })
    expect(Object.keys(result)).toEqual(['dev', 'prod'])
    expect(result.dev.s3BucketRows.length).toBe(1)
    expect(result.prod.s3BucketRows.length).toBe(1)
  })

  test('Should handle empty environments array', () => {
    const result = resourcesByEnvironment({
      environments: [],
      tenantService: {}
    })
    expect(result).toEqual({})
  })

  test('Should handle missing tenantService keys gracefully', () => {
    const result = resourcesByEnvironment({
      environments: ['qa'],
      tenantService: {}
    })
    expect(result.qa.s3BucketRows).toEqual([])
    expect(result.qa.sqsQueues).toEqual([])
    expect(result.qa.snsTopics).toEqual([])
  })
})
