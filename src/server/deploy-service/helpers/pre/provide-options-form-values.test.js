import nock from 'nock'

import { config } from '~/src/config'
import { deployServiceOptionsFixture } from '~/src/__fixtures__/deploy-service/deploy-service-options'
import { provideOptionsFormValues } from '~/src/server/deploy-service/helpers/pre/provide-options-form-values'
import { existingServiceInfoFixture } from '~/src/__fixtures__/deploy-service/existing-service-info'
import { deploymentSessionFixture } from '~/src/__fixtures__/deploy-service/deployment-session'

describe('#provideOptionsFormValues', () => {
  const mockRequest = (deployment = null) => ({
    pre: { deployment }
  })

  const optionsEndpointUrl = new URL(
    config.get('selfServiceOpsApiUrl') + '/deploy-service/options'
  )

  const deploymentConfigEndpoint = new URL(
    config.get('portalBackendApiUrl') +
      `/deployment-config/cdp-portal-frontend/management`
  )

  beforeEach(() => {
    nock(optionsEndpointUrl.origin)
      .get(optionsEndpointUrl.pathname)
      .reply(200, deployServiceOptionsFixture)
  })

  describe('Without a deployment session', () => {
    test('Should provide expected form detail', async () => {
      expect(await provideOptionsFormValues.method(mockRequest())).toEqual({
        availableMemoryOptions: [
          {
            attributes: {
              selected: true
            },
            disabled: true,
            text: ' - - Choose a CPU value - - ',
            value: ''
          }
        ],
        cpuOptions: [
          {
            attributes: {
              selected: true
            },
            disabled: true,
            text: ' - - select - - ',
            value: ''
          },
          ...deployServiceOptionsFixture.cpuOptions
        ],
        formValues: {},
        preExistingDetails: false
      })
    })
  })

  describe('With a deployment session', () => {
    describe('And No previous deployment config', () => {
      beforeEach(() => {
        nock(deploymentConfigEndpoint.origin)
          .get(deploymentConfigEndpoint.pathname)
          .reply(200, {
            instanceCount: null,
            cpu: null,
            memory: null
          })
      })

      test('Should provide expected form detail', async () => {
        expect(
          await provideOptionsFormValues.method(
            mockRequest(deploymentSessionFixture)
          )
        ).toEqual({
          availableMemoryOptions: [
            {
              attributes: {
                selected: true
              },
              disabled: true,
              text: ' - - select - - ',
              value: ''
            },
            {
              text: '4 GB',
              value: 4096
            },
            {
              text: '5 GB',
              value: 5120
            },
            {
              text: '6 GB',
              value: 6144
            },
            {
              text: '7 GB',
              value: 7168
            },
            {
              text: '8 GB',
              value: 8192
            },
            {
              text: '9 GB',
              value: 9216
            },
            {
              text: '10 GB',
              value: 10240
            },
            {
              text: '11 GB',
              value: 11264
            },
            {
              text: '12 GB',
              value: 12288
            },
            {
              text: '13 GB',
              value: 13312
            },
            {
              text: '14 GB',
              value: 14336
            },
            {
              text: '15 GB',
              value: 15360
            },
            {
              text: '16 GB',
              value: 16384
            }
          ],
          cpuOptions: [
            {
              attributes: {
                selected: true
              },
              disabled: true,
              text: ' - - select - - ',
              value: ''
            },
            {
              text: '512 (.5 vCPU)',
              value: 512
            },
            {
              text: '1024 (1 vCPU)',
              value: 1024
            },
            {
              text: '2048 (2 vCPU)',
              value: 2048
            },
            {
              text: '4096 (4 vCPU)',
              value: 4096
            },
            {
              text: '8192 (8 vCPU)',
              value: 8192
            }
          ],
          formValues: {},
          preExistingDetails: false
        })
      })
    })

    describe('And previous deployment config', () => {
      beforeEach(() => {
        nock(deploymentConfigEndpoint.origin)
          .get(deploymentConfigEndpoint.pathname)
          .reply(200, existingServiceInfoFixture)
      })

      test('Should provide expected form detail', async () => {
        expect(
          await provideOptionsFormValues.method(
            mockRequest(deploymentSessionFixture)
          )
        ).toEqual({
          availableMemoryOptions: [
            {
              attributes: {
                selected: true
              },
              disabled: true,
              text: ' - - select - - ',
              value: ''
            },
            ...deployServiceOptionsFixture.ecsCpuToMemoryOptionsMap[2048]
          ],
          cpuOptions: [
            {
              attributes: {
                selected: true
              },
              disabled: true,
              text: ' - - select - - ',
              value: ''
            },
            ...deployServiceOptionsFixture.cpuOptions
          ],
          formValues: {
            cpu: '1024',
            instanceCount: 2,
            memory: '2048'
          },
          preExistingDetails: false
        })
      })
    })
  })
})
