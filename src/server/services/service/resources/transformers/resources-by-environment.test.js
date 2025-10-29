import { entitiesResourcesFixture } from '../../../../../__fixtures__/entities/entity.js'
import {
  resourcesByEnvironment,
  resourceByEnvironment
} from './resources-by-environment.js'

describe('#resourceByEnvironment', () => {
  test('Should return expected resources', () => {
    const result = resourceByEnvironment({
      environment: 'management',
      environmentDetails: entitiesResourcesFixture.envs.management
    })

    expect(result).toEqual({
      environment: 'management',
      s3BucketRows: [
        [
          {
            html: expect.stringContaining(
              's3://cdp-management-example-mock-service-frontend-1234567w'
            )
          }
        ]
      ],
      snsTopics: [],
      sqsQueues: [],
      database: null
    })
  })

  test('Should return empty arrays when tenantServiceForEnv is undefined', () => {
    const result = resourceByEnvironment({
      environment: 'dev'
    })
    expect(result).toEqual({
      environment: 'dev',
      s3BucketRows: [],
      sqsQueues: [],
      snsTopics: [],
      database: null
    })
  })

  test('Should return correct s3BucketRows with sorted urls', () => {
    const result = resourceByEnvironment({
      environment: 'prod',
      environmentDetails: {
        s3_buckets: [{ bucket_name: 'b-url' }, { bucket_name: 'a-url' }]
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
        sqs_queues: [
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
        sns_topics: [
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
    const result = resourcesByEnvironment({
      environments,
      allEnvironmentsDetails: entitiesResourcesFixture.envs
    })

    expect(result).toEqual({
      dev: {
        environment: 'dev',
        s3BucketRows: [
          [
            {
              html: expect.stringContaining(
                's3://cdp-dev-example-mock-service-frontend-1234567u'
              )
            }
          ]
        ],
        sqsQueues: [],
        snsTopics: [],
        database: null
      },
      prod: {
        environment: 'prod',
        s3BucketRows: [],
        sqsQueues: [],
        snsTopics: [],
        database: null
      }
    })
  })

  test('Should handle empty environments array', () => {
    const result = resourcesByEnvironment({
      environments: [],
      allEnvironmentsDetails: {}
    })
    expect(result).toEqual({})
  })
})
