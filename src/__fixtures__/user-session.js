/**
 * @type {UserSession}
 */
export const userSessionFixture = {
  id: '01b99595-27b5-4ab0-9807-f104c09d2cd0',
  displayName: 'RoboCop',
  email: 'robocop@robocop.com',
  loginHint: 'mock-login-hint-123456',
  isAuthenticated: true,
  token: 'mock-token-123456',
  refreshToken: 'mock-refresh-token-123456',
  isAdmin: true,
  isTenant: false,
  scope: [
    'permission:admin',
    'permission:breakGlass:team:platform',
    'permission:canGrantBreakGlass:team:platform',
    'permission:serviceOwner:team:platform',
    'team:platform',
    'user:01b99595-27b5-4ab0-9807-f104c09d2cd0'
  ],
  expiresIn: 4886000,
  expiresAt: '2025-09-01T16:58:35.826Z',
  hasBreakGlass: true
}

/**
 * @import {UserSession} from '../server/common/helpers/auth/get-user-session.js'
 */
