/**
 * The squid input into the platform state doesn't indicate which domains default ones as it's based off the final
 * built squid config, not the inputs.
 * Down the line we can have cdp-squid-config supply the default domains as inputs to the lambda, but for now
 * we're just going to hard-code them here as they don't change very often.
 *
 * @type {string[]}
 */
export const defaultSquidDomains = [
  '.amazonaws.com',
  '.auth.eu-west-2.amazoncognito.com',
  '.browserstack.com',
  '.cdp-int.defra.cloud',
  'api.notifications.service.gov.uk',
  'login.microsoftonline.com',
  'www.gov.uk',
  'dcidmtest.b2clogin.com',
  'dcidm.b2clogin.com',
  'your-account.pre.cui.defra.gov.uk',
  'dcidmpreprod.b2clogin.com',
  'your-account.cpdev.cui.defra.gov.uk',
  'your-account.defra.gov.uk',
  'a1927cb9-3f34-4982-a9bd-b638154692a1.tokens.sts.global.api.aws',
  'a128e3b1-9566-4e55-abbd-370709e9ffac.tokens.sts.global.api.aws',
  'a19dfab3-318a-47fa-8133-57c7670003c7.tokens.sts.global.api.aws',
  'a10fb1ec-c92d-425d-a063-ca5b89094843.tokens.sts.global.api.aws',
  'a1eaece8-e6ff-4af3-9bc9-d01ac996ea79.tokens.sts.global.api.aws',
  'a155c736-5fdd-4135-adcf-9bddf2ce038b.tokens.sts.global.api.aws',
  'a14ef9ed-f39e-4e3d-8d6f-2b422a7833a2.tokens.sts.global.api.aws',
  'www.googletagmanager.com'
].sort()
