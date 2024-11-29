import { canLaunchTerminal } from '~/src/server/services/terminal/helpers/can-launch-terminal.js'
import { scopes } from '~/src/server/common/constants/scopes.js'

describe('#canLaunchTerminal', () => {
  const mockRequest = (scopes) => ({
    auth: { credentials: { scope: scopes } }
  })

  test('Should not throw for Admin and allowed Admin environment', () => {
    expect(() =>
      canLaunchTerminal(mockRequest([scopes.admin]), 'dev')
    ).not.toThrow()
  })

  test('Should throw for Tenant with unavailable environment', () => {
    expect(() =>
      canLaunchTerminal(mockRequest([scopes.externalTest]), 'management')
    ).toThrow('Cannot launch terminal in this environment')
  })
})
