import { databaseStatus } from '~/src/server/deployments/constants/database-status.js'

function provideDatabaseStatusClassname(status) {
  switch (status) {
    case databaseStatus.succeeded:
      return 'item-detail--green'
    case databaseStatus.inProgress:
    case databaseStatus.requested:
      return 'item-detail--purple'
    case databaseStatus.stopped:
    case databaseStatus.timedOut:
      return 'item-detail--light-blue'
    case databaseStatus.failed:
    case databaseStatus.fault:
      return 'item-detail--red'
    default:
      return 'item-detail--grey'
  }
}

export { provideDatabaseStatusClassname }
