import Joi from 'joi'

import { allowedTerminalEnvironments } from '../allowed-terminal-environments.js'

function getAllowedEnvironments(options) {
  const userScopes = options.context.auth?.credentials?.scope
  const entity = options.context.app?.request?.entity

  return allowedTerminalEnvironments({ userScopes, entity })
}

function launchTerminalParamsValidation(params, options) {
  const allowedEnvironments = getAllowedEnvironments(options)
  const validationResult = Joi.object({
    serviceId: Joi.string().required(),
    environment: Joi.string()
      .valid(...allowedEnvironments)
      .required()
  }).validate(params, options)

  if (validationResult?.error) {
    throw validationResult.error
  }

  return validationResult.value
}

function terminalBrowserParamsValidation(params, options) {
  const allowedEnvironments = getAllowedEnvironments(options)
  const validationResult = Joi.object({
    serviceId: Joi.string().required(),
    environment: Joi.string()
      .valid(...allowedEnvironments)
      .required(),
    token: Joi.string().required()
  }).validate(params, options)

  if (validationResult?.error) {
    throw validationResult.error
  }

  return validationResult.value
}

export { terminalBrowserParamsValidation, launchTerminalParamsValidation }
