// Response from portalBackendApi/tenant-services/cdp-portal-backend

const tenantServicesFixture = {
  prod: {
    environment: 'prod',
    serviceName: 'cdp-portal-backend',
    zone: 'protected',
    mongo: true,
    redis: false,
    postgres: false,
    serviceCode: 'CDP',
    testSuite: null,
    buckets: ['prod-cdp-portal-backend-*'],
    queues: ['message_notification.fifo', 'message_clearance_request.fifo'],
    s3Buckets: [
      {
        name: 'prod-cdp-portal-backend-c63f2',
        versioning: 'Disabled',
        url: 's3://prod-cdp-portal-backend-c63f2-75ee2'
      },
      {
        name: 'prod-cdp-portal-backend-images-c63f2',
        versioning: 'Disabled',
        url: 's3://prod-cdp-portal-backend-images-c63f2-75ee2'
      }
    ],
    sqsQueues: [
      {
        name: 'message_clearance_request',
        crossAccountAllowList: [],
        dlqMaxReceiveCount: 3,
        fifoQueue: true,
        contentBasedDeduplication: false,
        visibilityTimeoutSeconds: 300,
        subscriptions: [
          {
            filterEnabled: false,
            filterPolicy: '',
            topics: ['message_clearance_request.fifo']
          }
        ],
        arn: 'arn:aws:sqs:eu-west-2:111111111:message_clearance_request.fifo',
        url: 'https://sqs.eu-west-2.amazonaws.com/111111111/message_clearance_request.fifo'
      },
      {
        name: 'message_notification',
        crossAccountAllowList: [],
        dlqMaxReceiveCount: 3,
        fifoQueue: true,
        contentBasedDeduplication: false,
        visibilityTimeoutSeconds: 300,
        subscriptions: [
          {
            filterEnabled: false,
            filterPolicy: '',
            topics: ['decision_notification.fifo']
          }
        ],
        arn: 'arn:aws:sqs:eu-west-2:111111111:message_notification.fifo',
        url: 'https://sqs.eu-west-2.amazonaws.com/111111111/message_notification.fifo'
      }
    ],
    snsTopics: [
      {
        name: 'decision_notification',
        fifoTopic: true,
        crossAccountAllowList: [],
        contentBasedDeduplication: false,
        arn: 'arn:aws:sns:eu-west-2:111111111:decision_notification.fifo'
      },
      {
        name: 'error_notification',
        fifoTopic: true,
        crossAccountAllowList: [],
        contentBasedDeduplication: false,
        arn: 'arn:aws:sns:eu-west-2:111111111:error_notification.fifo'
      }
    ],
    apiEnabled: null,
    apiType: null,
    teams: [
      {
        github: 'cdp-platform',
        teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
        name: 'Platform'
      }
    ]
  },
  'perf-test': {
    environment: 'perf-test',
    serviceName: 'cdp-portal-backend',
    zone: 'protected',
    mongo: true,
    redis: false,
    postgres: false,
    serviceCode: 'CDP',
    testSuite: null,
    buckets: null,
    queues: null,
    s3Buckets: null,
    sqsQueues: null,
    snsTopics: null,
    apiEnabled: null,
    apiType: null,
    teams: [
      {
        github: 'cdp-platform',
        teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
        name: 'Platform'
      }
    ]
  },
  dev: {
    environment: 'dev',
    serviceName: 'cdp-portal-backend',
    zone: 'protected',
    mongo: true,
    redis: false,
    postgres: false,
    serviceCode: 'CDP',
    testSuite: null,
    buckets: ['dev-cdp-portal-backend-*'],
    queues: ['message_notification.fifo', 'message_clearance_request.fifo'],
    s3Buckets: [
      {
        name: 'dev-cdp-portal-backend-c63f2',
        versioning: 'Disabled',
        url: 's3://dev-cdp-portal-backend-c63f2-c63f2'
      },
      {
        name: 'dev-cdp-portal-backend-images-c63f2',
        versioning: 'Disabled',
        url: 's3://dev-cdp-portal-backend-images-c63f2-c63f2'
      }
    ],
    sqsQueues: [
      {
        name: 'message_clearance_request',
        crossAccountAllowList: [],
        dlqMaxReceiveCount: 3,
        fifoQueue: true,
        contentBasedDeduplication: false,
        visibilityTimeoutSeconds: 300,
        subscriptions: [
          {
            filterEnabled: false,
            filterPolicy: '',
            topics: ['message_clearance_request.fifo']
          }
        ],
        arn: 'arn:aws:sqs:eu-west-2:333333333:message_clearance_request.fifo',
        url: 'https://sqs.eu-west-2.amazonaws.com/333333333/message_clearance_request.fifo'
      },
      {
        name: 'message_notification',
        crossAccountAllowList: [],
        dlqMaxReceiveCount: 3,
        fifoQueue: true,
        contentBasedDeduplication: false,
        visibilityTimeoutSeconds: 300,
        subscriptions: [
          {
            filterEnabled: false,
            filterPolicy: '',
            topics: ['decision_notification.fifo']
          }
        ],
        arn: 'arn:aws:sqs:eu-west-2:333333333:message_notification.fifo',
        url: 'https://sqs.eu-west-2.amazonaws.com/333333333/message_notification.fifo'
      }
    ],
    snsTopics: [
      {
        name: 'decision_notification',
        fifoTopic: true,
        crossAccountAllowList: [],
        contentBasedDeduplication: false,
        arn: 'arn:aws:sns:eu-west-2:333333333:decision_notification.fifo'
      },
      {
        name: 'error_notification',
        fifoTopic: true,
        crossAccountAllowList: [],
        contentBasedDeduplication: false,
        arn: 'arn:aws:sns:eu-west-2:333333333:error_notification.fifo'
      }
    ],
    apiEnabled: null,
    apiType: null,
    teams: [
      {
        github: 'cdp-platform',
        teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
        name: 'Platform'
      }
    ]
  },
  test: {
    environment: 'test',
    serviceName: 'cdp-portal-backend',
    zone: 'protected',
    mongo: true,
    redis: false,
    postgres: false,
    serviceCode: 'CDP',
    testSuite: null,
    buckets: ['test-cdp-portal-backend-*'],
    queues: ['message_notification.fifo', 'message_clearance_request.fifo'],
    s3Buckets: [
      {
        name: 'test-cdp-portal-backend-c63f2',
        versioning: 'Disabled',
        url: 's3://test-cdp-portal-backend-c63f2-6bf3a'
      },
      {
        name: 'test-cdp-portal-backend-images-c63f2',
        versioning: 'Disabled',
        url: 's3://test-cdp-portal-backend-images-c63f2-6bf3a'
      }
    ],
    sqsQueues: [
      {
        name: 'message_clearance_request',
        crossAccountAllowList: [],
        dlqMaxReceiveCount: 3,
        fifoQueue: true,
        contentBasedDeduplication: false,
        visibilityTimeoutSeconds: 300,
        subscriptions: [
          {
            filterEnabled: false,
            filterPolicy: '',
            topics: ['message_clearance_request.fifo']
          }
        ],
        arn: 'arn:aws:sqs:eu-west-2:444444444:message_clearance_request.fifo',
        url: 'https://sqs.eu-west-2.amazonaws.com/444444444/message_clearance_request.fifo'
      },
      {
        name: 'message_notification',
        crossAccountAllowList: [],
        dlqMaxReceiveCount: 3,
        fifoQueue: true,
        contentBasedDeduplication: false,
        visibilityTimeoutSeconds: 300,
        subscriptions: [
          {
            filterEnabled: false,
            filterPolicy: '',
            topics: ['decision_notification.fifo']
          }
        ],
        arn: 'arn:aws:sqs:eu-west-2:444444444:message_notification.fifo',
        url: 'https://sqs.eu-west-2.amazonaws.com/444444444/message_notification.fifo'
      }
    ],
    snsTopics: [
      {
        name: 'decision_notification',
        fifoTopic: true,
        crossAccountAllowList: [],
        contentBasedDeduplication: false,
        arn: 'arn:aws:sns:eu-west-2:444444444:decision_notification.fifo'
      },
      {
        name: 'error_notification',
        fifoTopic: true,
        crossAccountAllowList: [],
        contentBasedDeduplication: false,
        arn: 'arn:aws:sns:eu-west-2:444444444:error_notification.fifo'
      }
    ],
    apiEnabled: null,
    apiType: null,
    teams: [
      {
        github: 'cdp-platform',
        teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
        name: 'Platform'
      }
    ]
  },
  'ext-test': {
    environment: 'ext-test',
    serviceName: 'cdp-portal-backend',
    zone: 'protected',
    mongo: true,
    redis: false,
    postgres: false,
    serviceCode: 'CDP',
    testSuite: null,
    buckets: ['ext-test-cdp-portal-backend-*'],
    queues: ['message_notification.fifo', 'message_clearance_request.fifo'],
    s3Buckets: [
      {
        name: 'ext-test-cdp-portal-backend-c63f2',
        versioning: 'Disabled',
        url: 's3://ext-test-cdp-portal-backend-c63f2-8ec5c'
      },
      {
        name: 'ext-test-cdp-portal-backend-images-c63f2',
        versioning: 'Disabled',
        url: 's3://ext-test-cdp-portal-backend-images-c63f2-8ec5c'
      }
    ],
    sqsQueues: [
      {
        name: 'message_clearance_request',
        crossAccountAllowList: [],
        dlqMaxReceiveCount: 3,
        fifoQueue: true,
        contentBasedDeduplication: false,
        visibilityTimeoutSeconds: 300,
        subscriptions: [
          {
            filterEnabled: false,
            filterPolicy: '',
            topics: ['message_clearance_request.fifo']
          }
        ],
        arn: 'arn:aws:sqs:eu-west-2:888888888:message_clearance_request.fifo',
        url: 'https://sqs.eu-west-2.amazonaws.com/888888888/message_clearance_request.fifo'
      },
      {
        name: 'message_notification',
        crossAccountAllowList: [],
        dlqMaxReceiveCount: 3,
        fifoQueue: true,
        contentBasedDeduplication: false,
        visibilityTimeoutSeconds: 300,
        subscriptions: [
          {
            filterEnabled: false,
            filterPolicy: '',
            topics: ['decision_notification.fifo']
          }
        ],
        arn: 'arn:aws:sqs:eu-west-2:888888888:message_notification.fifo',
        url: 'https://sqs.eu-west-2.amazonaws.com/888888888/message_notification.fifo'
      }
    ],
    snsTopics: [
      {
        name: 'decision_notification',
        fifoTopic: true,
        crossAccountAllowList: [],
        contentBasedDeduplication: false,
        arn: 'arn:aws:sns:eu-west-2:888888888:decision_notification.fifo'
      },
      {
        name: 'error_notification',
        fifoTopic: true,
        crossAccountAllowList: [],
        contentBasedDeduplication: false,
        arn: 'arn:aws:sns:eu-west-2:888888888:error_notification.fifo'
      }
    ],
    apiEnabled: null,
    apiType: null,
    teams: [
      {
        github: 'cdp-platform',
        teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
        name: 'Platform'
      }
    ]
  },
  management: {
    environment: 'management',
    serviceName: 'cdp-portal-backend',
    zone: 'protected',
    mongo: true,
    redis: false,
    postgres: false,
    serviceCode: 'CDP',
    testSuite: null,
    buckets: [
      'management-cdp-portal-backend-*',
      'infra-dev-cdp-portal-backend-*'
    ],
    queues: ['message_notification.fifo', 'message_clearance_request.fifo'],
    s3Buckets: [
      {
        name: 'management-cdp-portal-backend',
        versioning: 'Disabled',
        url: 's3://management-cdp-portal-backend-75ee2'
      },
      {
        name: 'infra-dev-cdp-portal-backend',
        versioning: 'Disabled',
        url: 's3://infra-dev-cdp-portal-backend-75ee2'
      }
    ],
    sqsQueues: [
      {
        name: 'message_clearance_request',
        crossAccountAllowList: [],
        dlqMaxReceiveCount: 3,
        fifoQueue: true,
        contentBasedDeduplication: false,
        visibilityTimeoutSeconds: 300,
        subscriptions: [
          {
            filterEnabled: false,
            filterPolicy: '',
            topics: ['message_clearance_request.fifo']
          }
        ],
        arn: 'arn:aws:sqs:eu-west-2:111111111:message_clearance_request.fifo',
        url: 'https://sqs.eu-west-2.amazonaws.com/111111111/message_clearance_request.fifo'
      },
      {
        name: 'message_notification',
        crossAccountAllowList: [],
        dlqMaxReceiveCount: 3,
        fifoQueue: true,
        contentBasedDeduplication: false,
        visibilityTimeoutSeconds: 300,
        subscriptions: [],
        arn: 'arn:aws:sqs:eu-west-2:111111111:message_notification.fifo',
        url: 'https://sqs.eu-west-2.amazonaws.com/111111111/message_notification.fifo'
      }
    ],
    snsTopics: [
      {
        name: 'decision_notification',
        fifoTopic: true,
        crossAccountAllowList: [],
        contentBasedDeduplication: false,
        arn: 'arn:aws:sns:eu-west-2:111111111:decision_notification.fifo'
      },
      {
        name: 'error_notification',
        fifoTopic: true,
        crossAccountAllowList: [],
        contentBasedDeduplication: false,
        arn: 'arn:aws:sns:eu-west-2:111111111:error_notification.fifo'
      }
    ],
    apiEnabled: null,
    apiType: null,
    teams: [
      {
        github: 'cdp-platform',
        teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
        name: 'Platform'
      }
    ]
  },
  'infra-dev': {
    environment: 'infra-dev',
    serviceName: 'cdp-portal-backend',
    zone: 'protected',
    mongo: true,
    redis: false,
    postgres: false,
    serviceCode: 'CDP',
    testSuite: null,
    buckets: [
      'management-cdp-portal-backend-*',
      'infra-dev-cdp-portal-backend-*'
    ],
    queues: ['message_notification.fifo', 'message_clearance_request.fifo'],
    s3Buckets: [
      {
        name: 'management-cdp-portal-backend',
        versioning: 'Disabled',
        url: 's3://management-cdp-portal-backend-75ee2'
      },
      {
        name: 'infra-dev-cdp-portal-backend',
        versioning: 'Disabled',
        url: 's3://infra-dev-cdp-portal-backend-75ee2'
      }
    ],
    sqsQueues: [
      {
        name: 'message_clearance_request',
        crossAccountAllowList: [],
        dlqMaxReceiveCount: 3,
        fifoQueue: true,
        contentBasedDeduplication: false,
        visibilityTimeoutSeconds: 300,
        subscriptions: [
          {
            filterEnabled: false,
            filterPolicy: '',
            topics: ['message_clearance_request.fifo']
          }
        ],
        arn: 'arn:aws:sqs:eu-west-2:111111111:message_clearance_request.fifo',
        url: 'https://sqs.eu-west-2.amazonaws.com/111111111/message_clearance_request.fifo'
      },
      {
        name: 'message_notification',
        crossAccountAllowList: [],
        dlqMaxReceiveCount: 3,
        fifoQueue: true,
        contentBasedDeduplication: false,
        visibilityTimeoutSeconds: 300,
        subscriptions: [
          {
            filterEnabled: false,
            filterPolicy: '',
            topics: ['decision_notification.fifo', 'error_notification.fifo']
          }
        ],
        arn: 'arn:aws:sqs:eu-west-2:111111111:message_notification.fifo',
        url: 'https://sqs.eu-west-2.amazonaws.com/111111111/message_notification.fifo'
      }
    ],
    snsTopics: [
      {
        name: 'decision_notification',
        fifoTopic: true,
        crossAccountAllowList: [],
        contentBasedDeduplication: false,
        arn: 'arn:aws:sns:eu-west-2:111111111:decision_notification.fifo'
      },
      {
        name: 'error_notification',
        fifoTopic: true,
        crossAccountAllowList: [],
        contentBasedDeduplication: false,
        arn: 'arn:aws:sns:eu-west-2:111111111:error_notification.fifo'
      }
    ],
    apiEnabled: null,
    apiType: null,
    teams: [
      {
        github: 'cdp-platform',
        teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
        name: 'Platform'
      }
    ]
  }
}

export { tenantServicesFixture }
