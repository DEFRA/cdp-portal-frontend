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
      `/v2/deployment-config/cdp-portal-frontend/management`
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
    describe('And null previous deployment config values', () => {
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
          formValues: {},
          preExistingDetails: false
        })
      })
    })

    describe('And null previous deployment config', () => {
      beforeEach(() => {
        nock(deploymentConfigEndpoint.origin)
          .get(deploymentConfigEndpoint.pathname)
          .reply(200, null)
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
