import {
  launchTerminalPayloadValidation,
  terminalBrowserParamsValidation
} from './terminal-params-validation.js'

const entityWithProdDlq = {
  teams: [{ teamId: 'platform' }],
  environments: {
    prod: {
      sqs_queues: [
        {
          name: 'orders',
          deadletter_queue_arn:
            'arn:aws:sqs:eu-west-2:123456789012:orders-deadletter'
        }
      ]
    }
  }
}

const optionsFor = (scope, entity) => ({
  context: {
    auth: { credentials: { scope } },
    app: { request: { entity } }
  }
})

const ownerWithoutBreakGlass = [
  'permission:betaTester',
  'permission:serviceOwner:team:platform'
]

describe('#launchTerminalPayloadValidation', () => {
  test('Should allow prod without breakGlass when service has a prod DLQ', () => {
    const payload = { environment: 'prod', tool: 'sqs_tool' }

    expect(
      launchTerminalPayloadValidation(
        payload,
        optionsFor(ownerWithoutBreakGlass, entityWithProdDlq)
      )
    ).toEqual(payload)
  })

  test('Should reject prod without breakGlass when service has no prod DLQ', () => {
    const entity = { ...entityWithProdDlq, environments: {} }

    expect(() =>
      launchTerminalPayloadValidation(
        { environment: 'prod', tool: 'sqs_tool' },
        optionsFor(ownerWithoutBreakGlass, entity)
      )
    ).toThrow('"environment" must be one of')
  })
})

describe('#terminalBrowserParamsValidation', () => {
  test('Should allow prod without breakGlass when service has a prod DLQ', () => {
    const params = {
      serviceId: 'orders-backend',
      environment: 'prod',
      token: 'a'.repeat(64)
    }

    expect(
      terminalBrowserParamsValidation(
        params,
        optionsFor(ownerWithoutBreakGlass, entityWithProdDlq)
      )
    ).toEqual(params)
  })
})
