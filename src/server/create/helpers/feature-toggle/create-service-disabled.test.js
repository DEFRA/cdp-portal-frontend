import { isCreateServiceFeatureDisabled } from '~/src/server/create/helpers/feature-toggle/create-service-disabled.js'

describe('isCreateServiceFeatureDisabled', () => {
  const toggleKey = 'feature-toggle:create-service-disabled'
  const timeNow = new Date().toISOString()

  test('Should return true when create-service-disabled is enabled', async () => {
    const request = {
      featureToggles: {
        get: (toggleName) => {
          switch (toggleName) {
            case `${toggleKey}:enabled`:
              return 'true'
            case `${toggleKey}:created`:
              return timeNow
            default:
              return null
          }
        }
      }
    }

    const createDisabled = await isCreateServiceFeatureDisabled(request)

    expect(createDisabled).toBe(true)
  })

  test('Should return false when create-service-disabled is not enabled', async () => {
    const request = {
      featureToggles: {
        get: () => null
      }
    }

    const createDisabled = await isCreateServiceFeatureDisabled(request)

    expect(createDisabled).toBe(false)
  })
})
