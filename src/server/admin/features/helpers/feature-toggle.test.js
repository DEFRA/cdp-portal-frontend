import { addSeconds } from 'date-fns'

import { config } from '~/src/config/config.js'
import { FeatureToggleHelper } from '~/src/server/admin/features/helpers/feature-toggle.js'

describe('#FeatureToggleHelper', () => {
  const oneHour = 3600000
  let featureTogglesCache
  let featureToggleHelper

  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2025-07-12'))

    config.set('redis.ttl', oneHour)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  beforeEach(() => {
    featureTogglesCache = {
      get: jest.fn(),
      set: jest.fn()
    }
    featureToggleHelper = new FeatureToggleHelper(featureTogglesCache)
  })

  test('Should return null for a non-existent feature toggle', async () => {
    featureTogglesCache.get.mockResolvedValue(null)

    const result = await featureToggleHelper.get('non-existent-id')
    expect(result).toBeNull()
  })

  test('Should return feature toggle details if present in cache', async () => {
    const cachedData = JSON.stringify({
      enabled: true,
      enabledAt: '2025-07-12T00:00:00Z',
      expiresAt: '2023-07-12T01:00:00Z'
    })
    featureTogglesCache.get.mockResolvedValue(cachedData)

    const result = await featureToggleHelper.get('existing-id')
    expect(result).toEqual(JSON.parse(cachedData))
  })

  test('Should toggle a feature from disabled to enabled', async () => {
    const now = new Date()
    const expiresAt = addSeconds(now, oneHour / 1000)

    featureTogglesCache.get.mockResolvedValue(
      JSON.stringify({ enabled: false })
    )
    await featureToggleHelper.toggle('toggle-id')

    expect(featureTogglesCache.set).toHaveBeenCalledWith(
      'feature-toggle:toggle-id',
      JSON.stringify({
        enabled: true,
        enabledAt: now.toISOString(),
        expiresAt: expiresAt.toISOString()
      })
    )
  })

  test('Should toggle a feature from enabled to disabled', async () => {
    const now = new Date()
    const expiresAt = addSeconds(now, oneHour / 1000)

    featureTogglesCache.get.mockResolvedValue(JSON.stringify({ enabled: true }))

    await featureToggleHelper.toggle('toggle-id')

    expect(featureTogglesCache.set).toHaveBeenCalledWith(
      'feature-toggle:toggle-id',
      JSON.stringify({
        enabled: false,
        enabledAt: now.toISOString(),
        expiresAt: expiresAt.toISOString()
      })
    )
  })

  test('Should return false for a request path not matching any feature toggle', async () => {
    const result = await featureToggleHelper.isEnabled('/non-existent-path')
    expect(result).toBe(false)
  })

  test('Should return true for a request path matching an enabled feature toggle', async () => {
    featureTogglesCache.get.mockResolvedValue(JSON.stringify({ enabled: true }))
    const result = await featureToggleHelper.isEnabled('/create')
    expect(result).toBe(true)
  })

  test('Should return false for a request path matching a disabled feature toggle', async () => {
    featureTogglesCache.get.mockResolvedValue(
      JSON.stringify({ enabled: false })
    )
    const result = await featureToggleHelper.isEnabled('/create')
    expect(result).toBe(false)
  })

  test('Should handle missing enabledAt and expiresAt gracefully in getAll', async () => {
    featureTogglesCache.get.mockResolvedValue(null)
    const result = await featureToggleHelper.getAll()
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'disable-create-service',
          name: 'Disable create service',
          url: '/create',
          enabled: undefined,
          enabledAt: undefined,
          expiresAt: undefined
        })
      ])
    )
  })
})
