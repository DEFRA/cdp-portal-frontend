import { provideDeploymentStatusText } from '~/src/server/deployments/helpers/provide-deployment-status-text'

describe('#provideDeploymentStatusText', () => {
  test('Should provide expected "stopped" text on un-deployment', () => {
    expect(
      provideDeploymentStatusText({
        status: 'requested',
        desiredStatus: null,
        requestedCount: 0
      })
    ).toEqual('stopped')
  })

  test('Should provide expected "stopping" text', () => {
    expect(
      provideDeploymentStatusText({
        status: 'running',
        desiredStatus: 'stopped'
      })
    ).toEqual('stopping')
  })

  test('Should provide expected "deploying" text', () => {
    expect(
      provideDeploymentStatusText({
        status: 'requested',
        desiredStatus: 'running'
      })
    ).toEqual('deploying')
    expect(
      provideDeploymentStatusText({
        status: 'pending',
        desiredStatus: 'running'
      })
    ).toEqual('deploying')
  })

  test('Should provide expected "deployed" text', () => {
    expect(
      provideDeploymentStatusText({ status: 'running', desiredStatus: null })
    ).toEqual('deployed')
  })

  test('Should provide expected "failed" text', () => {
    expect(provideDeploymentStatusText({ status: 'failed' })).toEqual('failed')
  })

  test('Should provide expected "stopped" text', () => {
    expect(provideDeploymentStatusText({ status: 'stopped' })).toEqual(
      'stopped'
    )
  })

  test('Should provide expected "requested" text', () => {
    expect(provideDeploymentStatusText({ status: 'requested' })).toEqual(
      'requested'
    )
  })

  test('Should provide expected default text', () => {
    expect(provideDeploymentStatusText({ status: 'whoopWhoop' })).toEqual(
      'pending'
    )
  })
})
