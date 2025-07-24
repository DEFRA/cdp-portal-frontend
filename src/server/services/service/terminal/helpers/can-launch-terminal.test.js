import { describe, expect, test } from 'vitest'
import { canLaunchTerminal } from './can-launch-terminal.js'
import { scopes } from '../../../../common/constants/scopes.js'

describe('#canLaunchTerminal', () => {
  test('Should not throw for Admin and allowed environment', () => {
    expect(() => canLaunchTerminal([scopes.admin], 'dev')).not.toThrow()
  })

  test('Should not throw for Admin and allowed Admin environment', () => {
    expect(() => canLaunchTerminal([scopes.admin], 'infra-dev')).not.toThrow()
  })

  test('Should throw for Tenant with unavailable environment', () => {
    expect(() =>
      canLaunchTerminal([scopes.externalTest], 'management')
    ).toThrow('Cannot launch terminal in this environment')
  })

  test('Should throw for admin without break glass for prod', () => {
    expect(() => canLaunchTerminal([scopes.admin], 'prod')).toThrow(
      'Cannot launch terminal in this environment'
    )
  })

  test('Should not throw for break glass user with production environment', () => {
    expect(() => canLaunchTerminal([scopes.breakGlass], 'prod')).not.toThrow()
  })
})
