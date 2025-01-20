import { utilityToEntityRow } from '~/src/server/utilities/transformers/utility-to-entity-row.js'
import { sortByOwner } from '~/src/server/common/helpers/sort/sort-by-owner.js'

function buildUtilitiesTableData({
  utilities,
  utilityType,
  isAuthenticated,
  userScopeUUIDs
}) {
  const rowDecorator = utilityToEntityRow(utilityType, isAuthenticated)
  const ownerSorter = sortByOwner('id')

  const rows = utilities
    .map((utility) => ({
      ...utility,
      isOwner: utility.teams?.some((team) =>
        userScopeUUIDs.includes(team.teamId)
      )
    }))
    .toSorted(ownerSorter)
    .map(rowDecorator)

  return rows
}

export { buildUtilitiesTableData }
