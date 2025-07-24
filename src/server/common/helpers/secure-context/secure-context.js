import tls from 'node:tls'

import { getTrustStoreCerts } from './get-trust-store-certs.js'

const secureContext = {
  plugin: {
    name: 'secure-context',
    register: (server) => {
      const originalCreateSecureContext = tls.createSecureContext

      tls.createSecureContext = (options = {}) => {
        const trustStoreCerts = getTrustStoreCerts(process.env)

        if (!trustStoreCerts.length) {
          server.logger.info('Could not find any TRUSTSTORE_ certificates')
        }

        const tlsSecureContext = originalCreateSecureContext(options)

        trustStoreCerts.forEach((cert) => {
          tlsSecureContext.context.addCACert(cert)
        })

        return tlsSecureContext
      }

      server.decorate('server', 'secureContext', tls.createSecureContext())
    }
  }
}

export { secureContext }
