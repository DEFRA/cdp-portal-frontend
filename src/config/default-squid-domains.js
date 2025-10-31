/**
 * The squid input into the platform state doesn't indicate which domains default ones as it's based off the final
 * built squid config, not the inputs.
 * Down the line we can have cdp-squid-config supply the default domains as inputs to the lambda, but for now
 * we're just going to hard-code them here as they don't change very often.
 *
 * @type {string[]}
 */
const defaultSquidDomains = [
  '.amazonaws.com',
  '.auth.eu-west-2.amazoncognito.com',
  '.browserstack.com',
  '.cdp-int.defra.cloud',
  'api.notifications.service.gov.uk',
  'login.microsoftonline.com',
  'www.gov.uk'
].sort()

export { defaultSquidDomains }
