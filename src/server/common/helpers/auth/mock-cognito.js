import { createLogger } from '../logging/logger.js'

const logger = createLogger()

class MockCognitoFederatedCredentialProvider {
  constructor(hardCodedToken) {
    this.token = hardCodedToken
  }

  async getToken() {
    return this.token
  }
}

export const mockCognitoFederatedCredentials = {
  plugin: {
    name: 'federated-credentials',
    version: '1.0.0',
    register: (server) => {
      logger.warn(
        'Using MOCK federated credential provider! This should NOT be used in real environments!'
      )
      const tokenProvider = new MockCognitoFederatedCredentialProvider(
        crypto.randomUUID()
      )
      server.decorate('server', 'federatedCredentials', tokenProvider)
    }
  }
}
