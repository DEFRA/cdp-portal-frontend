import { checkSessionIsValid } from './check-session-is-valid.js'

describe('#checkSessionIsValid', () => {
  test('Should redirect to the start URL when session data is null and path does not match start URL', () => {
    const urlTemplates = { stepOne: '/start/{param}' }
    const request = {
      app: { multiStepFormId: 'form123' },
      yar: { get: vitest.fn().mockReturnValue(null) },
      path: '/current',
      params: { param: 'value' }
    }
    const h = {
      redirect: vitest.fn().mockReturnValue({ takeover: vitest.fn() }),
      continue: Symbol('continue')
    }

    const handler = checkSessionIsValid(urlTemplates)
    handler(request, h)

    expect(h.redirect).toHaveBeenCalledWith('/start/value')
    expect(h.redirect().takeover).toHaveBeenCalledTimes(1)
  })

  test('Should continue when session data is not null', () => {
    const urlTemplates = { stepOne: '/start/{param}' }
    const request = {
      app: { multiStepFormId: 'form123' },
      yar: { get: vitest.fn().mockReturnValue({ userId: 1234 }) },
      path: '/current',
      params: { param: 'value' }
    }
    const h = { redirect: vitest.fn(), continue: Symbol('continue') }

    const handler = checkSessionIsValid(urlTemplates)
    const result = handler(request, h)

    expect(result).toBe(h.continue)
  })

  test('Should continue when path matches the start URL and session data is null', () => {
    const urlTemplates = { stepOne: '/start/{param}' }
    const request = {
      app: { multiStepFormId: 'form123' },
      yar: { get: vitest.fn().mockReturnValue(null) },
      path: '/start/value',
      params: { param: 'value' }
    }
    const h = { redirect: vitest.fn(), continue: Symbol('continue') }

    const handler = checkSessionIsValid(urlTemplates)
    const result = handler(request, h)

    expect(result).toBe(h.continue)
  })

  test('Should handle missing multiStepFormId gracefully', () => {
    const urlTemplates = { stepOne: '/start/{param}' }
    const request = {
      app: {},
      yar: { get: vitest.fn(() => null) },
      path: '/current',
      params: { param: 'value' }
    }
    const h = {
      redirect: vitest.fn().mockReturnValue({ takeover: vitest.fn() }),
      continue: Symbol('continue')
    }

    const handler = checkSessionIsValid(urlTemplates)
    handler(request, h)

    expect(h.redirect).toHaveBeenCalledWith('/start/value')
    expect(h.redirect().takeover).toHaveBeenCalled()
  })
})
