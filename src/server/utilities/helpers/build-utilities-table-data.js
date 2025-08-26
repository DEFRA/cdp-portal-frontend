import { utilityToEntityRow } from '../transformers/utility-to-entity-row.js'
import { sortByOwner } from '../../common/helpers/sort/sort-by-owner.js'
import { entityOwnerDecorator } from '../../test-suites/helpers/decorators/entity-owner-decorator.js'

function buildUtilitiesTableData({
  utilities,
  utilityType,
  isAuthenticated,
  userScopes
}) {
  const rowDecorator = utilityToEntityRow(utilityType, isAuthenticated)
  const ownerSorter = sortByOwner('id')

  return utilities
    .map(entityOwnerDecorator(userScopes))
    .toSorted(ownerSorter)
    .map(rowDecorator)
}

export { buildUtilitiesTableData }
