import { buildDatabaseLogsLink } from '~/src/server/deployments/helpers/build-database-logs-link.js'

describe('#buildDatabaseLogsLink', () => {
  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2025-04-01'))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  test('Should return a valid link when all parameters are provided', () => {
    const options = {
      environment: 'dev',
      buildId:
        'arn:aws:codebuild:eu-west-2:333333333:build/cdp-example-node-postgres-be-liquibase:77a042d0-b293-44fa-be2b-d3f6f3389240',
      created: '2025-03-26T16:38:28.979Z',
      updated: '2025-03-26T16:42:21.916Z',
      service: 'test-service'
    }
    const result = buildDatabaseLogsLink(options, true)
    expect(result).toBe(
      "https://logs.dev.cdp-int.defra.cloud/_dashboards/app/data-explorer/discover#?_a=(discover:(columns:!(_source),isDirty:!t,sort:!()),metadata:(indexPattern:'894813c0-2665-11f0-9fe1-f1edecda3ce8',view:discover))&_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:'2025-03-26T16:38:28.000',to:'2025-03-26T16:42:21.000'))&_q=(filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'894813c0-2665-11f0-9fe1-f1edecda3ce8',key:service,negate:!f,params:(query:test-service),type:phrase),query:(match_phrase:(service:test-service))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'894813c0-2665-11f0-9fe1-f1edecda3ce8',key:build.id,negate:!f,params:(query:'test-service%3A77a042d0-b293-44fa-be2b-d3f6f3389240'),type:phrase),query:(match_phrase:(build.id:'test-service%3A77a042d0-b293-44fa-be2b-d3f6f3389240')))),query:(language:kuery,query:''))"
    )
  })

  test('Should use "now" as the "to" value when hasResult is false', () => {
    const options = {
      environment: 'dev',
      buildId:
        'arn:aws:codebuild:eu-west-2:333333333:build/cdp-example-node-postgres-be-liquibase:77a042d0-b293-44fa-be2b-d3f6f3389240',
      created: '2025-03-26T16:38:28.979Z',
      updated: '2025-03-26T16:42:21.916Z',
      service: 'test-service'
    }
    const result = buildDatabaseLogsLink(options, false)
    expect(result).toContain("to:'now'")
  })

  test('Should encode special characters in the service name and build ID', () => {
    const options = {
      environment: 'dev',
      buildId:
        'arn:aws:codebuild:eu-west-2:333333333:build/cdp-example-node-postgres-be-liquibase:77a042d0-b293-44fa-be2b-d3f6f3389240',
      created: '2025-03-26T16:38:28.979Z',
      updated: '2025-03-26T16:42:21.916Z',
      service: 'test-service'
    }
    const result = buildDatabaseLogsLink(options, true)
    expect(result).toContain(
      'test-service%3A77a042d0-b293-44fa-be2b-d3f6f3389240'
    )
  })
})
