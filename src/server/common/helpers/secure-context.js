import tls from 'node:tls'

import { config } from '~/src/config'

const secureContext = {
  plugin: {
    name: 'secure-context',
    register: async () => {
      const originalCreateSecureContext = tls.createSecureContext

      tls.createSecureContext = (options) => {
        const pem = Buffer.from(config.get('cdpCaCerts'), 'base64')
        const certs = pem
          .toString()
          .match(
            /-----BEGIN CERTIFICATE-----\n[\s\S]+?\n-----END CERTIFICATE-----/g
          )

        if (!certs) {
          throw new Error(`Could not parse CDP certificates`)
        }

        const context = originalCreateSecureContext(options)
        certs.forEach((cert) => {
          context.context.addCACert(cert.trim())
        })

        return context
      }
    }
  }
}

export { secureContext }
