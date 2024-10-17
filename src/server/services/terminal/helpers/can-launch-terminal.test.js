import { canLaunchTerminal } from '~/src/server/services/terminal/helpers/can-launch-terminal'

describe('#canLaunchTerminal', () => {
  const mockRequest = (isAdmin) => ({
    getUserSession: jest.fn().mockResolvedValue({ isAdmin })
  })

  test('Should not throw for Admin and allowed Admin environment', () => {
    expect(() => canLaunchTerminal(mockRequest(true), 'dev')).not.toThrow()
  })

  test('Should throw for Tenant with unavailable environment', async () => {
    await expect(() =>
      canLaunchTerminal(mockRequest(false), 'management')
    ).rejects.toThrow('Cannot launch terminal in this environment')
  })
})
