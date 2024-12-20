import { renderTestComponent } from '~/test-helpers/component-helpers.js'

describe('Tabs Component', () => {
  let $tabs, $tabsList

  const getTab = (tabNumber) =>
    $tabsList.find(`[data-testid*="app-tabs-list-item-${tabNumber}"]`)

  describe('With child content', () => {
    beforeEach(() => {
      $tabs = renderTestComponent(
        'tabs',
        {
          tabs: [
            { isActive: true, url: '/tab-one', label: 'One' },
            { isActive: false, url: '/tab-two', label: 'Two' },
            { isActive: false, url: '/tab-three', label: 'Three' }
          ]
        },
        '<p>Example Tab child html</p>'
      )

      $tabsList = $tabs('[data-testid="app-tabs-list"]')
    })

    test('Should render expected first tab', () => {
      const $firstTab = getTab(1)

      expect($firstTab.attr('class')).toContain('app-tabs__list-item--selected')
      expect($firstTab.find('a').attr('href')).toBe('/tab-one')
      expect($firstTab.find('a').text().trim()).toBe('One')
    })

    test('Should render expected second tab', () => {
      const $secondTab = getTab(2)

      expect($secondTab.attr('class')).not.toContain(
        'app-tabs__list-item--selected'
      )
      expect($secondTab.find('a').attr('href')).toBe('/tab-two')
      expect($secondTab.find('a').text().trim()).toBe('Two')
    })

    test('Should render expected third tab', () => {
      const $thirdTab = getTab(3)

      expect($thirdTab.attr('class')).not.toContain(
        'app-tabs__list-item--selected'
      )
      expect($thirdTab.find('a').attr('href')).toBe('/tab-three')
      expect($thirdTab.find('a').text().trim()).toBe('Three')
    })

    test('Should render expected tab panel content', () => {
      const $tabPanel = $tabs('[data-testid="app-tabs-panel"]')

      expect($tabPanel.html().trim()).toBe('<p>Example Tab child html</p>')
    })
  })

  describe('With panel text content', () => {
    beforeEach(() => {
      $tabs = renderTestComponent('tabs', {
        tabs: [
          {
            isActive: true,
            url: '/tab-one',
            label: 'One',
            panel: { text: 'Example Tab text content' }
          },
          { isActive: false, url: '/tab-two', label: 'Two' },
          { isActive: false, url: '/tab-three', label: 'Three' }
        ]
      })
    })

    test('Should render expected tab panel text content', () => {
      const $tabPanel = $tabs('[data-testid="app-tabs-panel"]')

      expect($tabPanel.text().trim()).toBe('Example Tab text content')
    })
  })

  describe('With panel html content', () => {
    beforeEach(() => {
      $tabs = renderTestComponent('tabs', {
        tabs: [
          {
            isActive: true,
            url: '/tab-one',
            label: 'One',
            panel: { html: 'Example Tab html content' }
          },
          { isActive: false, url: '/tab-two', label: 'Two' },
          { isActive: false, url: '/tab-three', label: 'Three' }
        ]
      })
    })

    test('Should render expected tab panel text content', () => {
      const $tabPanel = $tabs('[data-testid="app-tabs-panel"]')

      expect($tabPanel.text().trim()).toBe('Example Tab html content')
    })
  })

  describe('When tabs are turned off', () => {
    beforeEach(() => {
      $tabs = renderTestComponent(
        'tabs',
        {
          displayTabs: false,
          tabs: [
            { isActive: true, url: '/tab-one', label: 'One' },
            { isActive: false, url: '/tab-two', label: 'Two' },
            { isActive: false, url: '/tab-three', label: 'Three' }
          ]
        },
        '<p>Example Tab child html</p>'
      )

      $tabsList = $tabs('[data-testid="app-tabs-list"]')
    })

    test('Should not render tabs', () => {
      const $firstTab = getTab(1)
      const $secondTab = getTab(2)
      const $thirdTab = getTab(3)

      expect($firstTab).toHaveLength(0)
      expect($secondTab).toHaveLength(0)
      expect($thirdTab).toHaveLength(0)
    })

    test('Should render expected tab panel content', () => {
      const $tabPanel = $tabs('[data-testid="app-tabs-panel"]')

      expect($tabPanel.html().trim()).toBe('<p>Example Tab child html</p>')
    })
  })
})
