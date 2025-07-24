import {
  renderComponent,
  renderIcon
} from '../../common/helpers/nunjucks/render-component.js'

function testSuiteToEntityRow(testSuite) {
  const icon = testSuite.isOwner
    ? renderComponent(
        'tool-tip',
        {
          text: 'Owned Test Suite',
          classes: 'app-tool-tip--small'
        },
        [
          renderIcon('star-icon', {
            classes: 'app-icon--minuscule'
          })
        ]
      )
    : ''

  const teams = testSuite?.teams
    ?.filter((team) => team.teamId)
    ?.map((team) => ({
      kind: 'link',
      value: team.name,
      url: `/teams/${team.teamId}`
    }))

  return {
    cells: [
      {
        headers: 'owner',
        isCentered: true,
        classes: 'app-entity-table__cell--owned',
        entity: { kind: 'html', value: icon }
      },
      {
        headers: 'test-suite',
        entity: {
          kind: 'link',
          value: testSuite.name,
          url: `/test-suites/${testSuite.name}`
        }
      },
      {
        headers: 'team',
        entity: {
          kind: 'list',
          value: teams?.length ? teams : null
        }
      },
      {
        headers: 'kind',
        entity: {
          kind: 'text',
          value: testSuite.subType
        }
      },
      {
        headers: 'created',
        entity: {
          kind: 'date',
          value: testSuite.created
        }
      }
    ]
  }
}

export { testSuiteToEntityRow }
