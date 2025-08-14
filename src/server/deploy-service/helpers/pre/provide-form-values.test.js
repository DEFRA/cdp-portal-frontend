import nock from 'nock'

import { config } from '../../../../config/config.js'
import { deployServiceOptionsFixture } from '../../../../__fixtures__/deploy-service/deploy-service-options.js'
import { provideFormValues } from './provide-form-values.js'
import { existingServiceInfoFixture } from '../../../../__fixtures__/deploy-service/existing-service-info.js'
import {
  deploymentSessionFixture,
  prototypeDeploymentSessionFixture
} from '../../../../__fixtures__/deploy-service/deployment-session.js'

describe('#provideFormValues', () => {
  const mockRequest = (stepData = null) => ({
    pre: { stepData }
  })

  const optionsEndpointUrl = new URL(
    config.get('selfServiceOpsUrl') + '/deploy-service/options'
  )

  const deploymentConfigEndpoint = new URL(
    config.get('portalBackendUrl') +
      `/deployment-settings/cdp-portal-frontend/management`
  )

  const prototypeDeploymentConfigEndpoint = new URL(
    config.get('portalBackendUrl') +
      `/deployment-settings/cdp-portal-prototype/dev`
  )

  beforeEach(() => {
    nock(optionsEndpointUrl.origin)
      .get(optionsEndpointUrl.pathname)
      .reply(200, deployServiceOptionsFixture)
  })

  describe('Without a deployment session', () => {
    test('Should provide expected form detail', async () => {
      expect(await provideFormValues.method(mockRequest())).toEqual({
        formValues: {
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
          preExistingDetails: false
        }
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
          await provideFormValues.method(mockRequest(deploymentSessionFixture))
        ).toEqual({
          formValues: {
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
            preExistingDetails: false
          }
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
          await provideFormValues.method(mockRequest(deploymentSessionFixture))
        ).toEqual({
          formValues: {
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
            preExistingDetails: false
          }
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
          await provideFormValues.method(mockRequest(deploymentSessionFixture))
        ).toEqual({
          formValues: {
            cpu: '1024',
            instanceCount: 2,
            memory: '2048',
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
            preExistingDetails: false
          }
        })
      })
    })

    describe('With a prototype session', () => {
      beforeEach(() => {
        nock(prototypeDeploymentConfigEndpoint.origin)
          .get(prototypeDeploymentConfigEndpoint.pathname)
          .reply(200, null)
      })

      test('Should provide expected form detail', async () => {
        expect(
          await provideFormValues.method(
            mockRequest(prototypeDeploymentSessionFixture)
          )
        ).toEqual({
          formValues: {
            availableMemoryOptions: [
              {
                text: ' - - Choose a CPU value - - ',
                value: '',
                disabled: true,
                attributes: {
                  selected: true
                }
              }
            ],
            cpuOptions: [
              {
                value: '',
                text: ' - - select - - ',
                disabled: true,
                attributes: {
                  selected: true
                }
              },
              {
                value: 512,
                text: '512 (.5 vCPU)'
              },
              {
                value: 1024,
                text: '1024 (1 vCPU)'
              }
            ],
            preExistingDetails: false,
            instanceCount: 1,
            isPrototype: true
          }
        })
      })
    })

    describe('With a prototype and previous deployment config', () => {
      beforeEach(() => {
        nock(prototypeDeploymentConfigEndpoint.origin)
          .get(prototypeDeploymentConfigEndpoint.pathname)
          .reply(200, existingServiceInfoFixture)
      })

      test('Should provide expected form detail', async () => {
        expect(
          await provideFormValues.method(
            mockRequest(prototypeDeploymentSessionFixture)
          )
        ).toEqual({
          formValues: {
            availableMemoryOptions: [
              {
                value: '',
                text: ' - - select - - ',
                disabled: true,
                attributes: {
                  selected: true
                }
              },
              {
                value: 2048,
                text: '2 GB'
              },
              {
                value: 3072,
                text: '3 GB'
              }
            ],
            cpuOptions: [
              {
                value: '',
                text: ' - - select - - ',
                disabled: true,
                attributes: {
                  selected: true
                }
              },
              {
                value: 512,
                text: '512 (.5 vCPU)'
              },
              {
                value: 1024,
                text: '1024 (1 vCPU)'
              }
            ],
            preExistingDetails: true,
            instanceCount: 1,
            isPrototype: true,
            memory: '2048',
            cpu: '1024'
          }
        })
      })
    })
  })
})
