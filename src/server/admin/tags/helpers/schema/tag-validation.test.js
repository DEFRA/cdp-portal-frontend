import { tagValidation } from '~/src/server/admin/tags/helpers/schema/tag-validation.js'
import Joi from 'joi'
import { validation } from '~/src/server/common/constants/validation.js'

describe('tagValidation', () => {
  test('Should validate a valid tag and service', () => {
    const { error } = tagValidation.validate({
      tag: 'validTag',
      service: 'validService'
    })

    expect(error).toBeInstanceOf(Joi.ValidationError)
    expect(error.message).toBe('"tag" must be one of [tier-1, live, beta, prr]')
  })

  test('returns an error for an invalid tag', () => {
    const { error } = tagValidation.validate({
      tag: 'invalidTag',
      service: 'validService'
    })

    expect(error).toBeInstanceOf(Joi.ValidationError)
    expect(error.message).toBe('"tag" must be one of [tier-1, live, beta, prr]')
  })

  test('Should return an error for a missing tag', () => {
    const { error } = tagValidation.validate({ service: 'validService' })

    expect(error).toBeInstanceOf(Joi.ValidationError)
    expect(error.message).toBe(validation.chooseAnEntry)
  })

  test('Should return an error for an empty service', () => {
    const { error } = tagValidation.validate({ tag: 'validTag', service: '' })

    expect(error).toBeInstanceOf(Joi.ValidationError)
    expect(error.message).toBe('"tag" must be one of [tier-1, live, beta, prr]')
  })

  test('Should return an error for a missing service', () => {
    const { error } = tagValidation.validate({ tag: 'validTag' })

    expect(error).toBeInstanceOf(Joi.ValidationError)
    expect(error.message).toBe('"tag" must be one of [tier-1, live, beta, prr]')
  })
})
