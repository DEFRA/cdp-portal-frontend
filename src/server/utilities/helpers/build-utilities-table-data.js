import { utilityToEntityRow } from '~/src/server/utilities/transformers/utility-to-entity-row.js'
import { sortByOwner } from '~/src/server/common/helpers/sort/sort-by-owner.js'
import { entityOwnerDecorator } from '~/src/server/test-suites/helpers/decorators/entity-owner-decorator.js'

function buildUtilitiesTableData({
  utilities,
  utilityType,
  isAuthenticated,
  userScopeUUIDs
}) {
  const rowDecorator = utilityToEntityRow(utilityType, isAuthenticated)
  const ownerSorter = sortByOwner('id')

  return utilities
    .map(entityOwnerDecorator(userScopeUUIDs))
    .toSorted(ownerSorter)
    .map(rowDecorator)
}

export { buildUtilitiesTableData }
