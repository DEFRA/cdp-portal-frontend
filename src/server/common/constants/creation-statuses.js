// TODO when appropriate sort out the mismatch of casing and flags being different but meaning the same thing
const creationStatuses = {
  unknown: 'unknown',
  requested: 'requested',
  raised: 'raised',
  queued: 'queued',
  prOpen: 'pr_open',
  prClosed: 'pr_closed',
  merged: 'merged',
  inProgress: 'in-progress',
  InProgress: 'InProgress',
  notRequested: 'not-requested',
  success: 'success',
  created: 'created',
  creating: 'Creating',
  workflowCompleted: 'workflow_completed',
  failure: 'failure',
  failed: 'Failed',
  decommissioned: 'Decommissioned',
  decommissioning: 'Decommissioning'
}

export { creationStatuses }
