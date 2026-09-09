import { relativeDate } from '../../../helpers/date/relative-date.js'
import { availableVersionsFixture } from '../../../../../__fixtures__/available-versions.js'
import { buildSuggestions } from './build-suggestions.js'

describe('#buildSuggestions', () => {
  test('Should provide expected suggestions with hint', () => {
    expect(
      buildSuggestions(
        availableVersionsFixture.map((version) => ({
          text: `${version.tag} - ${relativeDate(version.created)}`,
          value: version.tag,
          hint: relativeDate(version.created)
        }))
      )
    ).toEqual([
      {
        attributes: {
          selected: true
        },
        disabled: true,
        text: ' - - select - - '
      },
      {
        hint: 'Thu 7th Mar 2024 at 11:48',
        text: '0.316.0 - Thu 7th Mar 2024 at 11:48',
        value: '0.316.0'
      },
      {
        hint: 'Wed 6th Mar 2024 at 14:32',
        text: '0.315.0 - Wed 6th Mar 2024 at 14:32',
        value: '0.315.0'
      },
      {
        hint: 'Wed 6th Mar 2024 at 13:11',
        text: '0.314.0 - Wed 6th Mar 2024 at 13:11',
        value: '0.314.0'
      },
      {
        hint: 'Wed 6th Mar 2024 at 13:06',
        text: '0.313.0 - Wed 6th Mar 2024 at 13:06',
        value: '0.313.0'
      },
      {
        hint: 'Tue 5th Mar 2024 at 14:55',
        text: '0.312.0 - Tue 5th Mar 2024 at 14:55',
        value: '0.312.0'
      }
    ])
  })

  test('Should provide expected suggestions without hint', () => {
    expect(
      buildSuggestions(
        availableVersionsFixture.map((version) => ({
          text: `${version.tag} - ${relativeDate(version.created)}`,
          value: version.tag
        }))
      )
    ).toEqual([
      {
        attributes: {
          selected: true
        },
        disabled: true,
        text: ' - - select - - '
      },
      {
        text: '0.316.0 - Thu 7th Mar 2024 at 11:48',
        value: '0.316.0'
      },
      {
        text: '0.315.0 - Wed 6th Mar 2024 at 14:32',
        value: '0.315.0'
      },
      {
        text: '0.314.0 - Wed 6th Mar 2024 at 13:11',
        value: '0.314.0'
      },
      {
        text: '0.313.0 - Wed 6th Mar 2024 at 13:06',
        value: '0.313.0'
      },
      {
        text: '0.312.0 - Tue 5th Mar 2024 at 14:55',
        value: '0.312.0'
      }
    ])
  })

  test('Should only remove items that are null or undefined', () => {
    const falseyValues = [null, undefined, 0, false, '']

    expect(
      buildSuggestions(
        availableVersionsFixture.map((version, i) => ({
          text: `${version.tag} - ${relativeDate(version.created)}`,
          value: version.tag,
          hint: falseyValues.at(i)
        }))
      )
    ).toEqual([
      {
        attributes: {
          selected: true
        },
        disabled: true,
        text: ' - - select - - '
      },
      {
        text: '0.316.0 - Thu 7th Mar 2024 at 11:48',
        value: '0.316.0'
      },
      {
        text: '0.315.0 - Wed 6th Mar 2024 at 14:32',
        value: '0.315.0'
      },
      {
        hint: 0,
        text: '0.314.0 - Wed 6th Mar 2024 at 13:11',
        value: '0.314.0'
      },
      {
        hint: false,
        text: '0.313.0 - Wed 6th Mar 2024 at 13:06',
        value: '0.313.0'
      },
      {
        hint: '',
        text: '0.312.0 - Tue 5th Mar 2024 at 14:55',
        value: '0.312.0'
      }
    ])
  })
})
