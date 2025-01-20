import { config } from '~/src/config/config.js'
import {
  renderComponent,
  renderIcon
} from '~/src/server/common/helpers/nunjucks/render-component.js'

function testSuiteToEntityRow(isAuthenticated) {
  return (testSuite) => {
    const githubOrg = config.get('githubOrg')

    const icon = testSuite.isOwner
      ? renderComponent(
          'tool-tip',
          {
            text: 'Owned Test Suite',
            classes: 'app-tool-tip--small'
          },
          [
            renderIcon('star-icon', {
              classes: 'app-icon--tiny'
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
        ...(isAuthenticated
          ? [
              {
                headers: 'owner',
                isCentered: true,
                classes: 'app-entity-table__cell--owned',
                entity: { kind: 'html', value: icon }
              }
            ]
          : []),
        {
          headers: 'test-suite',
          entity: {
            kind: 'link',
            value: testSuite.serviceName,
            url: `/test-suites/${testSuite.serviceName}`
          }
        },
        {
          headers: 'team',
          entity: {
            kind: 'group',
            value: teams?.length ? teams : null
          }
        },
        {
          headers: 'kind',
          entity: {
            kind: 'text',
            value: testSuite.testType
          }
        },
        {
          headers: 'github-repository',
          entity: {
            kind: 'link',
            value: `${githubOrg}/${testSuite.id}`,
            url: `https://github.com/${githubOrg}/${testSuite.id}`,
            newWindow: true
          }
        },
        {
          headers: 'last-ran',
          entity: {
            kind: 'date',
            value: testSuite.lastRun?.taskLastUpdated
          }
        },
        {
          headers: 'created',
          entity: {
            kind: 'date',
            value: testSuite.createdAt
          }
        }
      ]
    }
  }
}

export { testSuiteToEntityRow }
