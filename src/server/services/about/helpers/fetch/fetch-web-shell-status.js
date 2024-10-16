import fetch from 'node-fetch'

import { config } from '~/src/config'

async function fetchWebShellStatus(environment, token) {
  const endpoint =
    config.get('webShellUrl').replace('{environment}', environment) +
    `/${token}`

  return await fetch(endpoint)
}

export { fetchWebShellStatus }
