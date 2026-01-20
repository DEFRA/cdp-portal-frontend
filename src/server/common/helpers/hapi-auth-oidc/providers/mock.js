export class MockProvider {
  constructor({ token = crypto.randomUUID(), type = 'federated' }) {
    this.token = token
    this.type = type
  }

  async getCredentials(logger) {
    logger?.warn?.(
      `Using MOCK ${this.type} credential provider! This should NOT be used in real environments!`
    )
    logger?.info?.(`Retrieving hardcoded token ${this.token}`)
    return this.token
  }
}
