import { buildLogsLink } from '~/src/server/test-suites/helpers/build-logs-link'

describe('#buildLogsLink', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern')
    jest.setSystemTime(new Date('2023-04-01'))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  describe('Whilst tests are running', () => {
    test('Should provide expected link', () => {
      expect(
        buildLogsLink(
          {
            environment: 'infra-dev',
            created: '2024-02-26T16:38:28.979Z',
            taskArn:
              'arn:aws:ecs:eu-west-2:506190012364:task/infra-dev-ecs-public/7e4c74aa41e44a0399bef08711563715',
            taskLastUpdated: '2024-02-26T16:40:34.000Z'
          },
          false
        )
      ).toEqual(
        "https://logs.infra-dev.cdp-int.defra.cloud/_dashboards/app/discover#/?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:'2024-02-26T16:38:28.000',to:'now'))&amp;_a=(columns:!(_source),filters:!(),index:c0abdf20-d49c-11ee-9eac-1d3409bea15a,interval:auto,query:(language:kuery,query:'ecs_task_arn:arn:aws:ecs:eu-west-2:506190012364:task%2Finfra-dev-ecs-public%2F7e4c74aa41e44a0399bef08711563715'),sort:!())&_a=(columns:!(log),filters:!(),index:c0abdf20-d49c-11ee-9eac-1d3409bea15a,interval:auto,query:(language:kuery,query:''),sort:!())"
      )
    })
  })

  describe('When tests have finished', () => {
    test('Should provide expected link', () => {
      expect(
        buildLogsLink(
          {
            environment: 'infra-dev',
            created: '2024-02-26T16:38:28.979Z',
            taskArn:
              'arn:aws:ecs:eu-west-2:506190012364:task/infra-dev-ecs-public/7e4c74aa41e44a0399bef08711563715',
            taskLastUpdated: '2024-02-26T16:40:34.000Z'
          },
          true
        )
      ).toEqual(
        "https://logs.infra-dev.cdp-int.defra.cloud/_dashboards/app/discover#/?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:'2024-02-26T16:38:28.000',to:'2024-02-26T16:40:34.000'))&amp;_a=(columns:!(_source),filters:!(),index:c0abdf20-d49c-11ee-9eac-1d3409bea15a,interval:auto,query:(language:kuery,query:'ecs_task_arn:arn:aws:ecs:eu-west-2:506190012364:task%2Finfra-dev-ecs-public%2F7e4c74aa41e44a0399bef08711563715'),sort:!())&_a=(columns:!(log),filters:!(),index:c0abdf20-d49c-11ee-9eac-1d3409bea15a,interval:auto,query:(language:kuery,query:''),sort:!())"
      )
    })
  })
})
