import * as client from 'openid-client'
import { config } from '~/src/config/config.js'

import readline from 'readline'
import {ClientSecretJwt} from "openid-client";
import {getCognitoToken} from "~/src/server/common/helpers/auth/cognito.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})



// Prerequisites
export async function doLogin() {
  const server = new URL(config.get('oidcWellKnownConfigurationUrl'))
  const clientId = config.get('azureClientId')
  const clientSecret = config.get('azureClientSecret')
  /**
   * Value used in the authorization request as redirect_uri pre-registered at the
   * Authorization Server.
   */
  const redirect_uri = config.get('appBaseUrl') + '/auth/callback'

  // End of prerequisites

  const fedcred = await getCognitoToken()
  console.log(fedcred)

  const oidcConfig = await client.discovery(server, clientId, null, client.ClientSecretJwt(fedcred))

  const code_challenge_method = 'S256'

  /**
   * The following (code_verifier and potentially nonce) MUST be generated for
   * every redirect to the authorization_endpoint. You must store the
   * code_verifier and nonce in the end-user session such that it can be recovered
   * as the user gets redirected from the authorization server back to your
   * application.
   */
  const code_verifier = client.randomPKCECodeVerifier()
  const code_challenge = await client.calculatePKCECodeChallenge(code_verifier)
  let nonce = ''

  // redirect user to as.authorization_endpoint
  const parameters = {
    redirect_uri,
    scope: 'openid email',
    code_challenge,
    code_challenge_method
  }

  if (!oidcConfig.serverMetadata().supportsPKCE()) {
    nonce = client.randomNonce()
    parameters.nonce = nonce
  }

  const redirectTo = client.buildAuthorizationUrl(oidcConfig, parameters)
  console.log('redirecting to', redirectTo.href)


  {
    let currentUrl = null;
    rl.question('enter the url ', (answer) => {
      currentUrl = new URL(answer)
      rl.close()
    })

    //const currentUrl = getCurrentUrl()
    const tokens = await client.authorizationCodeGrant(oidcConfig, currentUrl, {
      pkceCodeVerifier: code_verifier,
      expectedNonce: nonce,
      idTokenExpected: true
    })

    const access_token = tokens.access_token
    const sub = tokens.claims()
    console.log('Token Endpoint Response', access_token)
    console.log('ID Token Claims', sub)

    const userInfo = await client.fetchUserInfo(oidcConfig, access_token, sub)
    console.log('UserInfo Response', userInfo)
  }
}
