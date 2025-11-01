// Response from portalBackendApi/entities/example-mock-service-frontend

const entitiesResourcesFixture = {
  name: 'example-mock-service-frontend',
  type: 'Microservice',
  subType: 'Frontend',
  primaryLanguage: null,
  created: '2024-02-09T16:40:18Z',
  creator: null,
  teams: [
    {
      teamId: 'platform',
      name: 'Platform'
    }
  ],
  status: 'Created',
  decommissioned: null,
  tags: [],
  environments: {
    'infra-dev': {
      urls: {
        'example-mock-service.gov.uk': {
          type: 'vanity',
          enabled: false,
          shuttered: false
        }
      },
      ecr_repository: null,
      s3_buckets: [
        {
          arn: 'arn:aws:s3:::cdp-infra-dev-example-mock-service-frontend-123456a',
          bucket_name: 'cdp-infra-dev-example-mock-service-frontend-123456a',
          bucket_domain_name:
            'cdp-infra-dev-example-mock-service-frontend-123456a.s3.eu-west-2.armazonsaws.com',
          versioning: 'Disabled'
        }
      ],
      sqs_queues: [
        {
          arn: 'arn:aws:sqs:eu-west-2:345345363465:cdp_platform_portal_events',
          name: 'cdp_platform_portal_events',
          url: 'https://sqs.eu-west-2.amazonaws.com/345345363465/cdp_platform_portal_events',
          fifo_queue: false,
          content_based_deduplication: false,
          receive_wait_time_seconds: 20,
          subscriptions: ['cdp_platform_portal_events']
        },
        {
          arn: 'arn:aws:sqs:eu-west-2:345345363465:cdp_workflow_events',
          name: 'cdp_workflow_events',
          url: 'https://sqs.eu-west-2.amazonaws.com/345345363465/cdp_workflow_events',
          fifo_queue: false,
          content_based_deduplication: false,
          receive_wait_time_seconds: 20,
          subscriptions: []
        }
      ],
      sns_topics: [
        {
          arn: 'arn:aws:sns:eu-west-2:345345363465:random_image_push',
          name: 'ecr_image_push',
          fifo_topic: false,
          content_based_deduplication: false
        },
        {
          arn: 'arn:aws:sns:eu-west-2:345345363465:deploys_other',
          name: 'ecs_deployments',
          fifo_topic: false,
          content_based_deduplication: false
        }
      ],
      sql_database: {
        arn: 'arn:aws:rds:eu-west-2:5466456456:cluster:example-mock-service-frontend',
        endpoint:
          'example-mock-service-frontend.cluster-ddfgd4456jk.eu-west-2.rds.amazonaws.com',
        reader_endpoint:
          'example-mock-service-frontend.cluster-ro-ddfgd4456jk.eu-west-2.rds.amazonaws.com',
        name: 'example-mock-service-frontend',
        port: 5422,
        engine_version: '16.8',
        engine: 'magical-postgresql',
        database_name: 'awesome-cakes'
      },
      dynamodb: [],
      api_gateway: null,
      cognito_identity_pool: null,
      bedrock_ai: null,
      tenant_config: {},
      logs: {
        name: 'example-mock-service-frontend',
        url: 'https://logs.infra-dev.example.mock.clouds.net/_dashboards/app/dashboards#/view/example-mock-service-frontend'
      },
      metrics: [],
      alerts: [],
      nginx: {
        servers: {}
      },
      squid: {
        domains: ['https://abc.com']
      }
    },
    management: {
      urls: {
        'example-mock-service-frontend.management.example.mock.clouds.net': {
          type: 'internal',
          enabled: false,
          shuttered: false
        }
      },
      ecr_repository: {
        arn: 'arn:aws:ecr:eu-west-2:094954420758:repository/example-mock-service-frontend',
        name: 'example-mock-service-frontend',
        url: '094954420758.dkr.ecr.eu-west-2.armazonsaws.com/example-mock-service-frontend'
      },
      s3_buckets: [
        {
          arn: 'arn:aws:s3:::cdp-management-example-mock-service-frontend-1234567w',
          bucket_name: 'cdp-management-example-mock-service-frontend-1234567w',
          bucket_domain_name:
            'cdp-management-example-mock-service-frontend-1234567w.s3.eu-west-2.armazonsaws.com',
          versioning: 'Disabled'
        }
      ],
      sqs_queues: [],
      sns_topics: [],
      sql_database: null,
      dynamodb: [],
      api_gateway: null,
      cognito_identity_pool: null,
      bedrock_ai: null,
      tenant_config: {},
      logs: {
        name: 'example-mock-service-frontend',
        url: 'https://logs.management.example.mock.clouds.net/_dashboards/app/dashboards#/view/example-mock-service-frontend'
      },
      metrics: [],
      alerts: [],
      nginx: {
        servers: {}
      },
      squid: {
        ports: [80, 443],
        domains: ['https://abc.com']
      }
    },
    dev: {
      urls: {
        'example-mock-service-frontend.dev.example.mock.clouds.net': {
          type: 'internal',
          enabled: false,
          shuttered: true
        }
      },
      ecr_repository: null,
      s3_buckets: [
        {
          arn: 'arn:aws:s3:::cdp-dev-example-mock-service-frontend-1234567u',
          bucket_name: 'cdp-dev-example-mock-service-frontend-1234567u',
          bucket_domain_name:
            'cdp-dev-example-mock-service-frontend-1234567u.s3.eu-west-2.armazonsaws.com',
          versioning: 'Disabled'
        }
      ],
      sqs_queues: [],
      sns_topics: [],
      sql_database: null,
      dynamodb: [],
      api_gateway: null,
      cognito_identity_pool: null,
      bedrock_ai: null,
      tenant_config: {},
      logs: {
        name: 'example-mock-service-frontend',
        url: 'https://logs.dev.example.mock.clouds.net/_dashboards/app/dashboards#/view/example-mock-service-frontend'
      },
      metrics: [],
      alerts: [],
      nginx: {
        servers: {}
      },
      squid: {
        ports: [80, 443],
        domains: ['https://abc.com']
      }
    },
    'ext-test': {
      urls: {
        'example-mock-service-frontend.ext-test.example.mock.clouds.net': {
          type: 'internal',
          enabled: false,
          shuttered: false
        }
      },
      ecr_repository: null,
      s3_buckets: [
        {
          arn: 'arn:aws:s3:::cdp-infra-dev-example-mock-service-frontend-123456a',
          bucket_name: 'cdp-infra-dev-example-mock-service-frontend-123456a',
          bucket_domain_name:
            'cdp-infra-dev-example-mock-service-frontend-123456a.s3.eu-west-2.armazonsaws.com',
          versioning: 'Disabled'
        }
      ],
      sqs_queues: [
        {
          arn: 'arn:aws:sqs:eu-west-2:345345363465:cdp_platform_portal_events',
          name: 'cdp_platform_portal_events',
          url: 'https://sqs.eu-west-2.amazonaws.com/345345363465/cdp_platform_portal_events',
          fifo_queue: false,
          content_based_deduplication: false,
          receive_wait_time_seconds: 20,
          subscriptions: ['cdp_platform_portal_events']
        },
        {
          arn: 'arn:aws:sqs:eu-west-2:345345363465:cdp_workflow_events',
          name: 'cdp_workflow_events',
          url: 'https://sqs.eu-west-2.amazonaws.com/345345363465/cdp_workflow_events',
          fifo_queue: false,
          content_based_deduplication: false,
          receive_wait_time_seconds: 20,
          subscriptions: []
        }
      ],
      sns_topics: [
        {
          arn: 'arn:aws:sns:eu-west-2:345345363465:random_image_push',
          name: 'ecr_image_push',
          fifo_topic: false,
          content_based_deduplication: false
        },
        {
          arn: 'arn:aws:sns:eu-west-2:345345363465:deploys_other',
          name: 'ecs_deployments',
          fifo_topic: false,
          content_based_deduplication: false
        }
      ],
      sql_database: {
        arn: 'arn:aws:rds:eu-west-2:5466456456:cluster:example-mock-service-frontend',
        endpoint:
          'example-mock-service-frontend.cluster-ddfgd4456jk.eu-west-2.rds.amazonaws.com',
        reader_endpoint:
          'example-mock-service-frontend.cluster-ro-ddfgd4456jk.eu-west-2.rds.amazonaws.com',
        name: 'example-mock-service-frontend',
        port: 5422,
        engine_version: '16.8',
        engine: 'magical-postgresql',
        database_name: 'awesome-cakes'
      },
      dynamodb: [],
      api_gateway: null,
      cognito_identity_pool: null,
      bedrock_ai: null,
      tenant_config: {
        logs: {
          name: 'example-mock-service-frontend',
          url: 'https://logs.ext-test.example.mock.clouds.net/_dashboards/app/dashboards#/view/example-mock-service-frontend'
        },
        metrics: [],
        alerts: [],
        nginx: {
          servers: {}
        },
        squid: {
          ports: [80, 443],
          domains: ['https://abc.com']
        }
      },
      test: {
        urls: {
          'example-mock-service-frontend.test.example.mock.clouds.net': {
            type: 'internal',
            enabled: false,
            shuttered: false
          }
        },
        ecr_repository: null,
        s3_buckets: [
          {
            arn: 'arn:aws:s3:::cdp-test-example-mock-service-frontend-1234567o',
            bucket_name: 'cdp-test-example-mock-service-frontend-1234567o',
            bucket_domain_name:
              'cdp-test-example-mock-service-frontend-1234567o.s3.eu-west-2.armazonsaws.com',
            versioning: 'Disabled'
          }
        ],
        sqs_queues: [],
        sns_topics: [],
        sql_database: null,
        dynamodb: [],
        api_gateway: null,
        cognito_identity_pool: null,
        bedrock_ai: null,
        tenant_config: {},
        logs: {
          name: 'example-mock-service-frontend',
          url: 'https://logs.test.example.mock.clouds.net/_dashboards/app/dashboards#/view/example-mock-service-frontend'
        },
        metrics: [],
        alerts: [],
        nginx: {
          servers: {}
        },
        squid: {
          ports: [80, 443],
          domains: ['https://abc.com']
        }
      },
      'perf-test': {
        urls: {
          'example-mock-service-frontend.perf-test.example.mock.clouds.net': {
            type: 'internal',
            enabled: false,
            shuttered: false
          }
        },
        ecr_repository: null,
        s3_buckets: [
          {
            arn: 'arn:aws:s3:::cdp-perf-test-example-mock-service-frontend-1234556s',
            bucket_name: 'cdp-perf-test-example-mock-service-frontend-1234556s',
            bucket_domain_name:
              'cdp-perf-test-example-mock-service-frontend-1234556s.s3.eu-west-2.armazonsaws.com',
            versioning: 'Disabled'
          }
        ],
        sqs_queues: [],
        sns_topics: [],
        sql_database: null,
        dynamodb: [],
        api_gateway: null,
        cognito_identity_pool: null,
        bedrock_ai: null,
        tenant_config: {},
        logs: {
          name: 'example-mock-service-frontend',
          url: 'https://logs.perf-test.example.mock.clouds.net/_dashboards/app/dashboards#/view/example-mock-service-frontend'
        },
        metrics: [],
        alerts: [],
        nginx: {
          servers: {}
        }
      },
      squid: {
        ports: [80, 443],
        domains: ['https://abc.com']
      }
    }
  },
  metadata: {
    created: '2024-02-09T16:40:18Z',
    name: 'example-mock-service-frontend',
    service_code: 'CDP',
    subtype: 'Frontend',
    type: 'Microservice',
    teams: ['platform'],
    environments: null
  },
  progress: {}
}

export { entitiesResourcesFixture }
