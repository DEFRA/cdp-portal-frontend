import { transformDeployment } from '~/src/server/deployments/transformers/transform-deployment'
import { deploymentRequestedFixture } from '~/src/__fixtures__/deployment-requested'
import { deploymentInProgressFixture } from '~/src/__fixtures__/deployment-in-progress'
import { deploymentSuccessFixture } from '~/src/__fixtures__/deployment-success'
import { deploymentFailedFixture } from '~/src/__fixtures__/deployment-failed'

describe('#transformDeployment', () => {
  describe('When a deployment has been requested', () => {
    test('Should provide expected status', () => {
      expect(transformDeployment(deploymentRequestedFixture)).toEqual(
        expect.objectContaining({
          status: expect.objectContaining({
            text: 'requested'
          })
        })
      )
    })

    test('Should provide expected transformation', () => {
      expect(transformDeployment(deploymentRequestedFixture)).toEqual({
        deployedAt: '2024-01-17T18:46:36.171Z',
        deploymentId: '3f5dff54-9bea-4a53-830d-96610af8c2b4',
        dockerImage: 'cdp-portal-frontend',
        environment: 'infra-dev',
        instanceCount: 1,
        service: 'cdp-portal-frontend',
        status: {
          classes: 'govuk-tag--purple',
          hasFinished: false,
          text: 'requested'
        },
        tasks: [],
        user: 'The Terminator',
        userId: '0ddadf17-beaf-4aef-a415-ca044dbdd18d',
        version: '0.217.0'
      })
    })
  })

  describe('When a deployment is in progress', () => {
    test('Should provide expected status', () => {
      expect(transformDeployment(deploymentInProgressFixture)).toEqual(
        expect.objectContaining({
          status: expect.objectContaining({
            text: 'pending'
          })
        })
      )
    })

    test('Should provide expected transformation', () => {
      expect(transformDeployment(deploymentInProgressFixture)).toEqual({
        cpu: '1024',
        deployedAt: '2024-01-16T17:23:55Z',
        deploymentId: '3f5dff54-9bea-4a53-830d-96610af8c2b4',
        dockerImage:
          '123456789.dkr.ecr.eu-west-2.amazonaws.com/cdp-portal-frontend:0.225.0',
        environment: 'management',
        instanceCount: 2,
        memory: '2048',
        service: 'cdp-portal-frontend',
        status: {
          classes: 'govuk-tag--blue',
          hasFinished: false,
          text: 'pending'
        },
        tasks: {
          'arn:aws:ecs:eu-west-2:123456789:task/management-ecs-public/118daf6fe0fe4893bff72048f25fc67e':
            {
              cpu: '1024',
              deployedAt: '2024-01-16T17:23:55Z',
              deploymentId: '3f5dff54-9bea-4a53-830d-96610af8c2b4',
              dockerImage:
                '123456789.dkr.ecr.eu-west-2.amazonaws.com/cdp-portal-frontend:0.225.0',
              ecsSvcDeploymentId: 'ecs-svc/8544336582308964577',
              environment: 'management',
              instanceCount: 2,
              instanceTaskId:
                'arn:aws:ecs:eu-west-2:123456789:task/management-ecs-public/118daf6fe0fe4893bff72048f25fc67e',
              memory: '2048',
              service: 'cdp-portal-frontend',
              status: {
                classes: 'govuk-tag--blue',
                hasFinished: false,
                text: 'pending'
              },
              taskId:
                'arn:aws:ecs:eu-west-2:123456789:task-definition/cdp-portal-frontend:108',
              user: 'RoboCop',
              userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
              version: '0.225.0'
            },
          'arn:aws:ecs:eu-west-2:123456789:task/management-ecs-public/9bbfdb65e16449a781107c40d2bd175e':
            {
              cpu: '1024',
              deployedAt: '2024-01-16T17:23:52Z',
              deploymentId: '3f5dff54-9bea-4a53-830d-96610af8c2b4',
              dockerImage:
                '123456789.dkr.ecr.eu-west-2.amazonaws.com/cdp-portal-frontend:0.225.0',
              ecsSvcDeploymentId: 'ecs-svc/8544336582308964577',
              environment: 'management',
              instanceCount: 2,
              instanceTaskId:
                'arn:aws:ecs:eu-west-2:123456789:task/management-ecs-public/9bbfdb65e16449a781107c40d2bd175e',
              memory: '2048',
              service: 'cdp-portal-frontend',
              status: {
                classes: 'govuk-tag--blue',
                hasFinished: false,
                text: 'pending'
              },
              taskId:
                'arn:aws:ecs:eu-west-2:123456789:task-definition/cdp-portal-frontend:108',
              user: 'RoboCop',
              userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
              version: '0.225.0'
            }
        },
        user: 'RoboCop',
        userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
        version: '0.225.0'
      })
    })
  })

  describe('When a deployment has been successful', () => {
    test('Should provide expected status', () => {
      expect(transformDeployment(deploymentSuccessFixture)).toEqual(
        expect.objectContaining({
          status: expect.objectContaining({
            text: 'deployed'
          })
        })
      )
    })

    test('Should provide expected transformation', () => {
      expect(transformDeployment(deploymentSuccessFixture)).toEqual({
        cpu: '1024',
        deployedAt: '2024-01-16T17:24:27Z',
        deploymentId: '3f5dff54-9bea-4a53-830d-96610af8c2b4',
        dockerImage:
          '123456789.dkr.ecr.eu-west-2.amazonaws.com/cdp-portal-frontend:0.225.0',
        environment: 'management',
        instanceCount: 2,
        memory: '2048',
        service: 'cdp-portal-frontend',
        status: {
          classes: 'govuk-tag--green',
          hasFinished: true,
          text: 'deployed'
        },
        tasks: {
          'arn:aws:ecs:eu-west-2:123456789:task/management-ecs-public/118daf6fe0fe4893bff72048f25fc67e':
            {
              cpu: '1024',
              deployedAt: '2024-01-16T17:24:27Z',
              deploymentId: '3f5dff54-9bea-4a53-830d-96610af8c2b4',
              dockerImage:
                '123456789.dkr.ecr.eu-west-2.amazonaws.com/cdp-portal-frontend:0.225.0',
              ecsSvcDeploymentId: 'ecs-svc/8544336582308964577',
              environment: 'management',
              instanceCount: 2,
              instanceTaskId:
                'arn:aws:ecs:eu-west-2:123456789:task/management-ecs-public/118daf6fe0fe4893bff72048f25fc67e',
              memory: '2048',
              service: 'cdp-portal-frontend',
              status: {
                classes: 'govuk-tag--green',
                hasFinished: false,
                text: 'deployed'
              },
              taskId:
                'arn:aws:ecs:eu-west-2:123456789:task-definition/cdp-portal-frontend:108',
              user: 'RoboCop',
              userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
              version: '0.225.0'
            },
          'arn:aws:ecs:eu-west-2:123456789:task/management-ecs-public/9bbfdb65e16449a781107c40d2bd175e':
            {
              cpu: '1024',
              deployedAt: '2024-01-16T17:24:23Z',
              deploymentId: '3f5dff54-9bea-4a53-830d-96610af8c2b4',
              dockerImage:
                '123456789.dkr.ecr.eu-west-2.amazonaws.com/cdp-portal-frontend:0.225.0',
              ecsSvcDeploymentId: 'ecs-svc/8544336582308964577',
              environment: 'management',
              instanceCount: 2,
              instanceTaskId:
                'arn:aws:ecs:eu-west-2:123456789:task/management-ecs-public/9bbfdb65e16449a781107c40d2bd175e',
              memory: '2048',
              service: 'cdp-portal-frontend',
              status: {
                classes: 'govuk-tag--green',
                hasFinished: false,
                text: 'deployed'
              },
              taskId:
                'arn:aws:ecs:eu-west-2:123456789:task-definition/cdp-portal-frontend:108',
              user: 'RoboCop',
              userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
              version: '0.225.0'
            }
        },
        user: 'RoboCop',
        userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
        version: '0.225.0'
      })
    })
  })

  describe('When a deployment has failed', () => {
    test('Should provide expected status', () => {
      expect(transformDeployment(deploymentFailedFixture)).toEqual(
        expect.objectContaining({
          status: expect.objectContaining({
            text: 'failed'
          })
        })
      )
    })

    test('Should provide expected transformation', () => {
      expect(transformDeployment(deploymentFailedFixture)).toEqual({
        cpu: '1024',
        deployedAt: '2024-01-16T17:24:27Z',
        deploymentId: '3f5dff54-9bea-4a53-830d-96610af8c2b4',
        dockerImage:
          '123456789.dkr.ecr.eu-west-2.amazonaws.com/cdp-portal-frontend:0.225.0',
        environment: 'management',
        instanceCount: 2,
        memory: '2048',
        service: 'cdp-portal-frontend',
        status: {
          classes: 'govuk-tag--red',
          hasFinished: false,
          text: 'failed'
        },
        tasks: {
          'arn:aws:ecs:eu-west-2:123456789:task/management-ecs-public/118daf6fe0fe4893bff72048f25fc67e':
            {
              cpu: '1024',
              deployedAt: '2024-01-16T17:24:27Z',
              deploymentId: '3f5dff54-9bea-4a53-830d-96610af8c2b4',
              dockerImage:
                '123456789.dkr.ecr.eu-west-2.amazonaws.com/cdp-portal-frontend:0.225.0',
              ecsSvcDeploymentId: 'ecs-svc/8544336582308964577',
              environment: 'management',
              instanceCount: 2,
              instanceTaskId:
                'arn:aws:ecs:eu-west-2:123456789:task/management-ecs-public/118daf6fe0fe4893bff72048f25fc67e',
              memory: '2048',
              service: 'cdp-portal-frontend',
              status: {
                classes: 'govuk-tag--green',
                hasFinished: false,
                text: 'deployed'
              },
              taskId:
                'arn:aws:ecs:eu-west-2:123456789:task-definition/cdp-portal-frontend:108',
              user: 'RoboCop',
              userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
              version: '0.225.0'
            },
          'arn:aws:ecs:eu-west-2:123456789:task/management-ecs-public/9bbfdb65e16449a781107c40d2bd175e':
            {
              cpu: '1024',
              deployedAt: '2024-01-16T17:24:23Z',
              deploymentId: '3f5dff54-9bea-4a53-830d-96610af8c2b4',
              dockerImage:
                '123456789.dkr.ecr.eu-west-2.amazonaws.com/cdp-portal-frontend:0.225.0',
              ecsSvcDeploymentId: 'ecs-svc/8544336582308964577',
              environment: 'management',
              instanceCount: 2,
              instanceTaskId:
                'arn:aws:ecs:eu-west-2:123456789:task/management-ecs-public/9bbfdb65e16449a781107c40d2bd175e',
              memory: '2048',
              service: 'cdp-portal-frontend',
              status: {
                classes: 'govuk-tag--red',
                hasFinished: false,
                text: 'failed'
              },
              taskId:
                'arn:aws:ecs:eu-west-2:123456789:task-definition/cdp-portal-frontend:108',
              user: 'RoboCop',
              userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
              version: '0.225.0'
            }
        },
        user: 'RoboCop',
        userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
        version: '0.225.0'
      })
    })
  })
})
