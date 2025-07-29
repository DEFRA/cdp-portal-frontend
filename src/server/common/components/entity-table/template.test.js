import { renderTestComponent } from '../../../../../test-helpers/component-helpers.js'
import { cdpTeamsFixture } from '../../../../__fixtures__/admin/cdp-teams.js'
import { transformTeamToEntityRow } from '../../../admin/teams/transformers/transform-team-to-entity-row.js'

describe('Entity Table Component', () => {
  let $entityTable

  const getHeader = (headerNumber) =>
    $entityTable(
      `[data-testid="app-entity-table-head"] [data-testid="app-entity-table-header-${headerNumber}"]`
    )

  describe('With entities', () => {
    beforeAll(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2025-01-20'))
    })

    afterAll(() => {
      vi.useRealTimers()
    })

    beforeEach(() => {
      const mockTeamEntityRows = cdpTeamsFixture.teams.map(
        transformTeamToEntityRow
      )
      $entityTable = renderTestComponent('entity-table', {
        headers: [
          { id: 'name', text: 'Name', width: '15' },
          { id: 'description', text: 'Description', width: '15' },
          { id: 'github-team', text: 'GitHub Team', width: '15' },
          { id: 'service-codes', text: 'Service Codes', width: '5' },
          { id: 'alert-emails', text: 'Alert Emails', width: '20' },
          { id: 'members', text: 'Members', width: '10' },
          { id: 'last-updated', text: 'Last Updated', width: '10' },
          { id: 'created', text: 'Created', width: '10' }
        ],
        rows: mockTeamEntityRows,
        noResult: 'No teams found'
      })
    })

    test('Should render app entity table component', () => {
      expect($entityTable('[data-testid="app-entity-table"]')).toHaveLength(1)
    })

    test('Should contain expected headings', () => {
      expect(getHeader(1).text().trim()).toBe('Name')
      expect(getHeader(2).text().trim()).toBe('Description')
      expect(getHeader(3).text().trim()).toBe('GitHub Team')
      expect(getHeader(4).text().trim()).toBe('Service Codes')
      expect(getHeader(5).text().trim()).toBe('Alert Emails')
      expect(getHeader(6).text().trim()).toBe('Members')
      expect(getHeader(7).text().trim()).toBe('Last Updated')
      expect(getHeader(8).text().trim()).toBe('Created')
    })

    test('Rows should contain expected width attribute', () => {
      expect(getHeader(1).attr('width')).toBe('15%')
      expect(getHeader(2).attr('width')).toBe('15%')
      expect(getHeader(3).attr('width')).toBe('15%')
      expect(getHeader(4).attr('width')).toBe('5%')
      expect(getHeader(5).attr('width')).toBe('20%')
      expect(getHeader(6).attr('width')).toBe('10%')
      expect(getHeader(7).attr('width')).toBe('10%')
      expect(getHeader(8).attr('width')).toBe('10%')
    })

    test('First row Should contain expected entities', () => {
      const getEntity = (entityNumber) =>
        $entityTable('[data-testid="app-entity-table-row-1"]').find(
          `[data-testid="app-entity-${entityNumber}"]`
        )

      expect(getEntity(1)).toHaveLength(1)
      expect(getEntity(1).html()).toContain('Fish-and-octopus')

      expect(getEntity(2)).toHaveLength(1)
      expect(getEntity(2).html()).toContain('All things sealife 🐠')

      expect(getEntity(3)).toHaveLength(1)
      expect(getEntity(3).html()).toContain('@fisheries')

      expect(getEntity(4)).toHaveLength(1)
      expect(getEntity(4).html()).toContain('FO')

      expect(getEntity(5)).toHaveLength(1)
      expect(getEntity(5).html()).toContain('robocop@robocop.com')

      expect(getEntity(6)).toHaveLength(1)
      expect(getEntity(6).html()).toContain('- - -')

      expect(getEntity(7)).toHaveLength(1)
      expect(getEntity(7).html()).toContain('2')

      expect(getEntity(8)).toHaveLength(1)
      expect(getEntity(8).html()).toContain('Wed 30th Aug 2023 at 08:08')

      expect(getEntity(9)).toHaveLength(1)
      expect(getEntity(9).html()).toContain('Thu 24th Aug 2023 at 14:20')
    })
  })

  describe('Without entities', () => {
    beforeEach(() => {
      $entityTable = renderTestComponent('entity-table', {
        headers: [
          { id: 'name', text: 'Name', width: '15' },
          { id: 'description', text: 'Description', width: '15' },
          { id: 'github-team', text: 'GitHub Team', width: '15' },
          { id: 'service-codes', text: 'Service Codes', width: '5' },
          { id: 'alert-emails', text: 'Alert Emails', width: '20' },
          { id: 'members', text: 'Members', width: '10' },
          { id: 'last-updated', text: 'Last Updated', width: '10' },
          { id: 'created', text: 'Created', width: '10' }
        ],
        rows: [],
        noResult: 'No teams found'
      })
    })

    test('Should render no results message', () => {
      expect(
        $entityTable('[data-testid="app-entity-table-no-results"]')
      ).toHaveLength(1)
      expect(
        $entityTable('[data-testid="app-entity-table-no-results"]')
          .text()
          .trim()
      ).toBe('No teams found')
    })
  })
})
