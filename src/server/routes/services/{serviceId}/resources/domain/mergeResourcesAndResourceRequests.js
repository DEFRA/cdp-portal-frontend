const resourceTypeProps = {
  s3_buckets: {
    resource: 's3',
    icon: 'aws-s3'
  },
  sqs_queues: {
    resource: 'sqs',
    icon: 'aws-sqs'
  },
  sns_topics: {
    resource: 'sns',
    icon: 'aws-sns'
  }
}

const bucketSuffix = {
  'infra-dev': '7df0c',
  management: '8dfff',
  dev: 'c63f2',
  test: '6bf3a',
  'perf-test': '05244',
  'ext-test': '8ec5c',
  prod: '75ee2'
}

// TODO: Try this out in the FE and then move to BE /entity/{name}/resources
export function mergeResourcesAndResourceRequests(
  resources,
  resourcesRequests,
  environment
) {
  const provisioningResources = []

  for (const request of resourcesRequests) {
    for (const [type, resources] of Object.entries(request.resources ?? {})) {
      const common = resourceTypeProps[type]

      for (const resource of resources) {
        const { name, ...properties } = resource
        const fullName = expandName(type, name, environment)

        if (resources[type]?.some(({ name }) => name === fullName)) {
          continue
        }

        provisioningResources.push([
          type,
          {
            name: fullName,
            resourceRequestId: request.id,
            ...common,
            properties
          }
        ])
      }
    }
  }

  const result = {}
  for (const [type, resourceList] of Object.entries(resources ?? {})) {
    result[type] = resourceList
  }

  for (const [type, provisioningResource] of provisioningResources) {
    result[type] = [...result[type], provisioningResource]
  }

  return result
}


function expandName(type, name, environment) {
  if (type === 's3_buckets') {
    return `${environment}-${name}-${bucketSuffix[environment]}`
  }

  return name
}
