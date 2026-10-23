import { test, expect } from 'vitest'
import userHasBreakGlass from './user-has-break-glass.js'
import { scopes } from '@defra/cdp-validation-kit'

test('Defaults to false', () => {
  expect(userHasBreakGlass()).equals(false)
})

test('Defaults to false with objects', () => {
  expect(userHasBreakGlass({}, {})).equals(false)
})

test('Return false for no break-glass', () => {
  expect(
    userHasBreakGlass(
      {
        scope: [scopes.tenant]
      },
      {
        teams: [
          {
            teamId: 'test'
          }
        ]
      }
    )
  ).equals(false)
})

test('Return true for user only break-glass', () => {
  expect(
    userHasBreakGlass({
      scope: [scopes.tenant, scopes.breakGlass]
    })
  ).equals(true)
})

test('Return false for break-glass with non-owning team', () => {
  expect(
    userHasBreakGlass(
      {
        scope: [scopes.tenant, `${scopes.breakGlass}:team:another`]
      },
      {
        teams: [
          {
            teamId: 'test'
          }
        ]
      }
    )
  ).equals(false)
})

test('Return true for break-glass with for owning team', () => {
  expect(
    userHasBreakGlass(
      {
        scope: [scopes.tenant, `${scopes.breakGlass}:team:test`]
      },
      {
        teams: [
          {
            teamId: 'test'
          }
        ]
      }
    )
  ).equals(true)
})
