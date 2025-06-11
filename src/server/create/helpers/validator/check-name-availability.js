import { checkNameIsAvailable } from '~/src/server/create/helpers/validator/check-name-is-available.js'

async function checkNameAvailability(value, helpers) {
  const nameIsAvailable = await checkNameIsAvailable(value)

  if (nameIsAvailable) {
    return value
  }

  return helpers.message({
    external: 'Name is already being used'
  })
}

export { checkNameAvailability }
