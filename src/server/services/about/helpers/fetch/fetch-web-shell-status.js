import fetch from 'node-fetch'

import { config } from '~/src/config'

function fetchWebShellStatus(environment, token) {
  const endpoint =
    config.get('webShellUrl').replace('{environment}', environment) +
    `/${token}`

  return fetch(endpoint)
}

export { fetchWebShellStatus }
