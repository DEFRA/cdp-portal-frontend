/**
 * @typedef {Object} deploymentSession - The deployment session created via the deployment multistep form
 * @property {string} [deploymentSession.imageName] - The deployment imageName.
 * @property {string} [deploymentSession.version] - The deployment version.
 * @property {string} [deploymentSession.environment] - The environment to be deployed to.
 * @property {number} [deploymentSession.instanceCount] - The deployment instance count.
 * @property {number} [deploymentSession.cpu] - The deployment cpu value.
 * @property {number} [deploymentSession.memory] - The deployment memory value.
 * @property {boolean} [deploymentSession.isSent] - If the deployment has been sent.
 * @property {boolean} [deploymentSession.isComplete] - If the deployment is complete.
 *
 * @type {{method: (function(*): deploymentSession), assign: string}}
 */
const provideDeploymentSession = {
  method: (request) => request.yar.get('deployment'),
  assign: 'deploymentSession'
}

export { provideDeploymentSession }
