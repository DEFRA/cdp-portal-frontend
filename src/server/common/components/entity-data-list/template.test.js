import { renderTestComponent } from '../../../../../test-helpers/component-helpers.js'

const dataListFixture = [
  {
    heading: {
      text: 'Apples'
    },
    entity: {
      kind: 'text',
      value: 'Russet'
    }
  },
  {
    heading: {
      text: 'Oranges'
    },
    entity: {
      kind: 'link',
      value: 'The man from Del monte',
      url: 'https://mock-url.io',
      newWindow: true
    }
  },
  {
    heading: {
      text: 'Pears'
    },
    entity: {
      kind: 'text',
      value: 'Comice'
    }
  }
]

describe('Entity Data List Component', () => {
  let $heading
  let $dataList

  beforeEach(() => {
    const $component = renderTestComponent('entity-data-list', {
      params: {
        heading: 'Fruits',
        items: dataListFixture
      }
    })

    $heading = $component('[data-testid="app-data-list-heading"]').first()
    $dataList = $component('[data-testid="app-data-list"]').first()
  })

  test('Should render with expected heading', () => {
    expect($heading.text()).toContain('Fruits')
  })

  test('Should render expected data list headings', () => {
    const getHeader = (headerNumber) =>
      $dataList.find(`[data-testid="app-data-list-heading-${headerNumber}"]`)

    expect(getHeader(1).text().trim()).toBe('Apples')
    expect(getHeader(2).text().trim()).toBe('Oranges')
    expect(getHeader(3).text().trim()).toBe('Pears')
  })

  test('Should render expected data list items', () => {
    const getItem = (itemNumber) =>
      $dataList.find(`[data-testid="app-data-list-item-${itemNumber}"]`)

    expect(getItem(1).text().trim()).toBe('Russet')
    expect(getItem(2).html().trim()).toContain('https://mock-url.io')
    expect(getItem(2).html().trim()).toContain('The man from Del monte')
    expect(getItem(3).text().trim()).toBe('Comice')
  })
})
