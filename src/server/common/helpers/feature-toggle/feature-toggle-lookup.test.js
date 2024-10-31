import {
  enableFeatureToggle,
  findFeatureToggle,
  isFeatureToggleEnabled,
  removeFeatureToggle
} from '~/src/server/common/helpers/feature-toggle/feature-toggle-lookup.js'

describe('feature-toggle-lookup', () => {
  const keyPrefix = 'feature-toggle:'
  const toggleName = 'create-service-disabled'
  const createdDate = new Date()
  const created = createdDate.toISOString()
  const createdEpoch = createdDate.getTime()

  const mockTogglesGet = jest.fn()
  const featureTogglesRead = {
    get: mockTogglesGet.mockImplementation((key) => {
      switch (key) {
        case `${keyPrefix}${toggleName}:enabled`:
          return 'true'
        case `${keyPrefix}${toggleName}:created`:
          return created
        default:
          return null
      }
    })
  }

  describe('findFeatureToggle', () => {
    test('Should return feature toggle', async () => {
      const toggle = await findFeatureToggle(featureTogglesRead, toggleName)

      expect(toggle).toEqual({
        enabled: true,
        created
      })
    })

    test('Should return null when feature toggle is not found', async () => {
      const toggle = await findFeatureToggle(
        featureTogglesRead,
        'non-existent-toggle'
      )

      expect(toggle).toBeNull()
    })
  })

  describe('isFeatureToggleEnabled', () => {
    test('Should return false when feature toggle is not found', async () => {
      const toggle = await isFeatureToggleEnabled(
        featureTogglesRead,
        'non-existent-toggle'
      )

      expect(toggle).toBeFalsy()
    })

    test('Should return true when toggle is enabled', async () => {
      const toggle = await isFeatureToggleEnabled(
        featureTogglesRead,
        toggleName
      )

      expect(toggle).toBeTruthy()
    })
  })

  describe('enableFeatureToggle', () => {
    const mockTogglesSet = jest.fn()
    const featureToggles = {
      set: mockTogglesSet
    }

    test('Should store toggle as enabled', async () => {
      await enableFeatureToggle(featureToggles, toggleName, created)

      expect(mockTogglesSet).toHaveBeenCalledWith(
        `${keyPrefix}${toggleName}:enabled`,
        'true'
      )
      expect(mockTogglesSet).toHaveBeenCalledWith(
        `${keyPrefix}${toggleName}:created`,
        created
      )
    })

    test('Should create now-ish created date', async () => {
      await enableFeatureToggle(featureToggles, toggleName)

      const toggleCreated = mockTogglesSet.mock.lastCall[1]
      const toggleEpoch = new Date(toggleCreated).getTime()
      expect(toggleEpoch).toBeGreaterThanOrEqual(createdEpoch)
      expect(toggleEpoch).toBeLessThanOrEqual(new Date().getTime())
    })

    test('Should create yesterday as created date', async () => {
      const yesterday = new Date()
      yesterday.setDate(new Date().getDate() - 1)

      await enableFeatureToggle(
        featureToggles,
        toggleName,
        yesterday.toISOString()
      )

      const toggleCreated = mockTogglesSet.mock.lastCall[1]
      const toggleEpoch = new Date(toggleCreated).getTime()
      expect(toggleEpoch).toBeGreaterThanOrEqual(yesterday.getTime())

      const midnight = new Date()
      midnight.setHours(0, 0, 0, 0)
      expect(toggleEpoch).toBeLessThan(midnight.getTime())
    })
  })

  describe('removeFeatureToggle', () => {
    const mockTogglesDrop = jest.fn()
    const featureToggles = {
      drop: mockTogglesDrop
    }

    test('Should remove toggle', async () => {
      await removeFeatureToggle(featureToggles, toggleName)
      expect(mockTogglesDrop).toHaveBeenCalledWith(
        `${keyPrefix}${toggleName}:enabled`
      )
      expect(mockTogglesDrop).toHaveBeenCalledWith(
        `${keyPrefix}${toggleName}:created`
      )
    })
  })
})
