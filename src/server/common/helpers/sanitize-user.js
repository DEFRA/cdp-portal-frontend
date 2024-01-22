import { noValue } from '~/src/server/common/constants/no-value'

function sanitizeUser(user) {
  if (!user || user?.trim() === 'n/a') {
    return noValue
  }

  return user
}

export { sanitizeUser }
