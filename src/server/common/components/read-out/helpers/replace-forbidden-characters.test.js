import { replaceForbiddenCharacters } from '~/src/server/common/components/read-out/helpers/replace-forbidden-characters'

describe('#replaceForbiddenCharacters', () => {
  test('Should provided expected sanitised result', () => {
    expect(
      replaceForbiddenCharacters(
        'What %^   $%£%£$%-a-$£%@^$^@  - loV^&elY $%^££ ----daY_123$%4'
      )
    ).toEqual('What---a----loVelY------daY_1234')
  })

  test('Space should be replaced with a hyphen', () => {
    expect(replaceForbiddenCharacters(' ')).toEqual('-')
  })

  test('Multiple spaces should be replaced with a hyphen', () => {
    expect(replaceForbiddenCharacters('      ')).toEqual('-')
  })

  test('Special character should be removed', () => {
    expect(replaceForbiddenCharacters('&')).toEqual('')
  })

  test('Multiple Special characters should be removed', () => {
    expect(replaceForbiddenCharacters('&$%$^$^')).toEqual('')
  })
})
