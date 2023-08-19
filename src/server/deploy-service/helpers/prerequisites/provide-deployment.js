import { sessionNames } from '~/src/server/common/constants/session-names'

/**
 * @typedef {Object} deployment - The deployment session created via the deployment multistep form
 * @property {string} [deployment.imageName] - The deployment imageName.
 * @property {string} [deployment.version] - The deployment version.
 * @property {string} [deployment.environment] - The environment to be deployed to.
 * @property {number} [deployment.instanceCount] - The deployment instance count.
 * @property {number} [deployment.cpu] - The deployment cpu value.
 * @property {number} [deployment.memory] - The deployment memory value.
 * @property {boolean} [deployment.isSent] - If the deployment has been sent.
 * @property {boolean} [deployment.isComplete] - If the deployment is complete.
 *
 * @type {{method: (function(*): deployment), assign: string}}
 */
const provideDeployment = {
  method: (request) => request.yar.get(sessionNames.deployment),
  assign: 'deployment'
}

export { provideDeployment }
