import { provideDeployment } from '~/src/server/deployments/helpers/pre/provide-deployment'
import { fetchDeployment } from '~/src/server/deployments/helpers/fetch/fetch-deployment'
import { deploymentInProgressFixture } from '~/src/__fixtures__/deployment-in-progress'
import { deploymentSuccessFixture } from '~/src/__fixtures__/deployment-success'

jest.mock('~/src/server/deployments/helpers/fetch/fetch-deployment')

describe('#provideDeployment', () => {
  const mockIsXhr = jest.fn()
  const mockRequest = {
    params: { deploymentId: '3f5dff54-9bea-4a53-830d-96610af8c2b4' },
    isXhr: mockIsXhr
  }

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('With an in-progress deployment', () => {
    beforeEach(() => {
      fetchDeployment.mockResolvedValue(deploymentInProgressFixture)
      mockIsXhr.mockReturnValue(false)
    })

    test('Should provide expected deployment', async () => {
      expect(await provideDeployment.method(mockRequest)).toEqual({
        cpu: '1024',
        deployedAt: '2024-01-16T17:23:55Z',
        deploymentId: '3f5dff54-9bea-4a53-830d-96610af8c2b4',
        dockerImage:
          '123456789.dkr.ecr.eu-west-2.amazonaws.com/cdp-portal-frontend:0.225.0',
        environment: 'management',
        events: {
          'arn:aws:ecs:eu-west-2:123456789:task': [
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
          ]
        },
        instanceCount: 2,
        memory: '2048',
        service: 'cdp-portal-frontend',
        status: {
          classes: 'govuk-tag--blue',
          hasFinished: false,
          text: 'pending'
        },
        user: 'RoboCop',
        userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
        version: '0.225.0'
      })
    })
  })

  describe('With a successful deployment', () => {
    beforeEach(() => {
      fetchDeployment.mockResolvedValue(deploymentSuccessFixture)
      mockIsXhr.mockReturnValue(false)
    })

    test('Should provide expected deployment', async () => {
      expect(await provideDeployment.method(mockRequest)).toEqual({
        cpu: '1024',
        deployedAt: '2024-01-16T17:24:27Z',
        deploymentId: '3f5dff54-9bea-4a53-830d-96610af8c2b4',
        dockerImage:
          '123456789.dkr.ecr.eu-west-2.amazonaws.com/cdp-portal-frontend:0.225.0',
        environment: 'management',
        events: {
          'arn:aws:ecs:eu-west-2:123456789:task': [
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
                hasFinished: true,
                text: 'deployed'
              },
              taskId:
                'arn:aws:ecs:eu-west-2:123456789:task-definition/cdp-portal-frontend:108',
              user: 'RoboCop',
              userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
              version: '0.225.0'
            },
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
                hasFinished: true,
                text: 'deployed'
              },
              taskId:
                'arn:aws:ecs:eu-west-2:123456789:task-definition/cdp-portal-frontend:108',
              user: 'RoboCop',
              userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
              version: '0.225.0'
            }
          ]
        },
        instanceCount: 2,
        memory: '2048',
        service: 'cdp-portal-frontend',
        status: {
          classes: 'govuk-tag--green',
          hasFinished: true,
          text: 'deployed'
        },
        user: 'RoboCop',
        userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
        version: '0.225.0'
      })
    })
  })
})
