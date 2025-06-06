/**
 * @type {{requested: string, pending: string, running: string, stopped: string, stopping: string, failed: string, undeployed: string}}
 */
const deploymentStatus = {
  requested: 'requested',
  pending: 'pending',
  running: 'running',
  stopped: 'stopped',
  stopping: 'stopping',
  failed: 'failed',
  undeployed: 'undeployed'
}

export { deploymentStatus }
