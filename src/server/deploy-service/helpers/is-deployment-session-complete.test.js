import { isDeploymentSessionComplete } from '~/src/server/deploy-service/helpers/is-deployment-session-complete'

describe('#isDeploymentSessionComplete', () => {
  test('Step one should be complete', () => {
    expect(
      isDeploymentSessionComplete({
        imageName: 'cdp-portal-frontend',
        version: '1.0.1',
        environment: 'test'
      })
    ).toEqual({
      stepOne: true,
      stepTwo: false,
      stepThree: false,
      stepFour: false
    })
  })

  test('Step two should be complete', () => {
    expect(
      isDeploymentSessionComplete({
        instanceCount: 0,
        cpu: 256,
        memory: 1024
      })
    ).toEqual({
      stepOne: false,
      stepTwo: true,
      stepThree: false,
      stepFour: false
    })
  })

  test('Step three should be complete', () => {
    expect(
      isDeploymentSessionComplete({
        isSent: true
      })
    ).toEqual({
      stepOne: false,
      stepTwo: false,
      stepThree: true,
      stepFour: false
    })
  })

  test('Step four should be complete', () => {
    expect(
      isDeploymentSessionComplete({
        isComplete: true
      })
    ).toEqual({
      stepOne: false,
      stepTwo: false,
      stepThree: false,
      stepFour: true
    })
  })

  describe('With no values', () => {
    test('No steps should be complete', () => {
      expect(isDeploymentSessionComplete({})).toEqual({
        stepOne: false,
        stepTwo: false,
        stepThree: false,
        stepFour: false
      })
    })
  })
})
