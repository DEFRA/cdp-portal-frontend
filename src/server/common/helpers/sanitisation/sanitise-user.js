import { noValue } from '../../constants/no-value.js'

function sanitiseUser(value) {
  if (!value || value?.trim() === 'n/a') {
    return noValue
  }

  return value
}

export { sanitiseUser }
