import { noValue } from '~/src/server/common/constants/no-value'

function sanitizeUser(value) {
  if (!value || value?.trim() === 'n/a') {
    return noValue
  }

  return value
}

export { sanitizeUser }
