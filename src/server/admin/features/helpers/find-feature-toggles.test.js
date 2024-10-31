import { findAllFeatureToggles } from '~/src/server/admin/features/helpers/find-feature-toggles.js'

describe('findAllFeatureToggles', () => {
  const keyPrefix = 'feature-toggle:'
  const createName = 'create-service-disabled'
  const createKey = `${keyPrefix}${createName}`
  const created = new Date().toISOString()
  const createTitle = 'Disable Create Service'
  const urlPrefix = '/admin/features/create-service-disabled'

  const mockTogglesGet = jest.fn()

  test('when enabled should return an array of enabled feature toggles', async () => {
    const featureTogglesLookup = {
      get: mockTogglesGet.mockImplementation((key) => {
        switch (key) {
          case `${createKey}:enabled`:
            return 'true'
          case `${createKey}:created`:
            return created
          default:
            return null
        }
      })
    }
    const request = {
      featureToggles: featureTogglesLookup
    }

    const featureToggles = await findAllFeatureToggles(request)

    expect(featureToggles).toEqual([
      {
        title: createTitle,
        enabled: true,
        created,
        urlPrefix
      }
    ])
  })

  test('when disabled should return an array of disabled feature toggles', async () => {
    const featureTogglesLookup = {
      get: mockTogglesGet.mockImplementation((key) => {
        switch (key) {
          case `${createKey}:enabled`:
            return 'false'
          case `${createKey}:created`:
            return created
          default:
            return null
        }
      })
    }
    const request = {
      featureToggles: featureTogglesLookup
    }

    const featureToggles = await findAllFeatureToggles(request)

    expect(featureToggles).toEqual([
      {
        title: createTitle,
        enabled: false,
        created,
        urlPrefix
      }
    ])
  })

  test('when not found should return an array of disabled feature toggles', async () => {
    const mockFeatureToggles = {
      get: mockTogglesGet
    }
    const request = {
      featureToggles: mockFeatureToggles
    }
    mockTogglesGet.mockReturnValue(null)

    const featureToggles = await findAllFeatureToggles(request)

    expect(featureToggles).toHaveLength(1)
    expect(featureToggles[0].title).toEqual(createTitle)
    expect(featureToggles[0].enabled).toBeFalsy()
    expect(featureToggles[0].created).toBeUndefined()
    expect(featureToggles[0].urlPrefix).toEqual(urlPrefix)
  })
})
