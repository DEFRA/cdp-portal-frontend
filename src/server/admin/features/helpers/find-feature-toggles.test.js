import { findAllFeatureToggles } from '~/src/server/admin/features/helpers/find-feature-toggles.js'

describe('findAllFeatureToggles', () => {
  const keyPrefix = 'feature-toggle:'
  const createName = 'create-service-disabled'
  const decomName = 'decommission-disabled'
  const createKey = `${keyPrefix}${createName}`
  const decomKey = `${keyPrefix}${decomName}`
  const created = new Date().toISOString()
  const createTitle = 'Disable Create Service'
  const decomTitle = 'Disable Decommissions'
  const createUrl = '/admin/features/create-service-disabled'
  const decomUrl = '/admin/features/decommission-disabled'

  const mockTogglesGet = jest.fn()

  test('when enabled should return an array of enabled feature toggles', async () => {
    const featureTogglesLookup = {
      get: mockTogglesGet.mockImplementation((key) => {
        switch (key) {
          case `${createKey}:enabled`:
            return 'true'
          case `${createKey}:created`:
            return created
          case `${decomKey}:enabled`:
            return 'true'
          case `${decomKey}:created`:
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
        urlPrefix: createUrl
      },
      {
        title: decomTitle,
        enabled: true,
        created,
        urlPrefix: decomUrl
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
          case `${decomKey}:enabled`:
            return 'false'
          case `${decomKey}:created`:
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
        urlPrefix: createUrl
      },
      {
        title: decomTitle,
        enabled: false,
        created,
        urlPrefix: decomUrl
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

    expect(featureToggles).toHaveLength(2)
    expect(featureToggles[0].title).toEqual(createTitle)
    expect(featureToggles[0].enabled).toBeFalsy()
    expect(featureToggles[0].created).toBeUndefined()
    expect(featureToggles[0].urlPrefix).toEqual(createUrl)
    expect(featureToggles[1].title).toEqual(decomTitle)
    expect(featureToggles[1].enabled).toBeFalsy()
    expect(featureToggles[1].created).toBeUndefined()
    expect(featureToggles[1].urlPrefix).toEqual(decomUrl)
  })
})
