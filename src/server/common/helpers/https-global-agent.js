import tls from 'node:tls'
import https from 'node:https'

import { config } from '~/src/config'

const httpsGlobalAgent = {
  plugin: {
    name: 'https-global-agent',
    register: () => {
      const truststoreCdpRootCa = Buffer.from(
        config.get('cdpCaCerts'),
        'base64'
      ).toString()

      https.globalAgent.options.ca = [
        ...tls.rootCertificates,
        ...[truststoreCdpRootCa]
      ]
    }
  }
}

export { httpsGlobalAgent }
