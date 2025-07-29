import { renderTestComponent } from '../../../../../test-helpers/component-helpers.js'

describe('Logs Dashboard Link Component', () => {
  let logsDashBoardLink

  describe('With default attributes', () => {
    beforeEach(() => {
      const $component = renderTestComponent('logs-dashboard-link', {
        params: {
          serviceName: 'cdp-portal-frontend',
          environment: 'management'
        }
      })

      logsDashBoardLink = $component(
        '[data-testid="app-logs-dashboard-link"]'
      ).first()
    })

    test('Should render with expected href attribute', () => {
      expect(logsDashBoardLink.attr('href')).toBe(
        "https://logs.management.cdp-int.defra.cloud/_dashboards/app/dashboards#/view/89f63d50-b6eb-11ee-a385-15667195f827?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-15m,to:now))&_a=(description:'',filters:!(('$state':(store:appState),meta:(alias:!n,controlledBy:'1705679462997',disabled:!f,index:e55f3890-5d4a-11ee-8f40-670c9b0b8093,key:container_name,negate:!f,params:(query:cdp-portal-frontend),type:phrase),query:(match_phrase:(container_name:cdp-portal-frontend)))),fullScreenMode:!f,options:(hidePanelTitles:!f,useMargins:!t),query:(language:kuery,query:''),timeRestore:!f,title:'CDP%20Service%20Dashboard',viewMode:view)"
      )
    })

    test('Should render with expected text', () => {
      expect(logsDashBoardLink.text().trim()).toBe(
        'https://logs.management.cdp-int.defra.cloud'
      )
    })
  })

  describe('With extended attributes', () => {
    beforeEach(() => {
      const $component = renderTestComponent('logs-dashboard-link', {
        params: {
          text: 'logs',
          classes: 'app-link--underline app-link--text-colour',
          serviceName: 'cdp-portal-frontend',
          environment: 'management'
        }
      })

      logsDashBoardLink = $component(
        '[data-testid="app-logs-dashboard-link"]'
      ).first()
    })

    test('Should render with expected custom class names', () => {
      expect(logsDashBoardLink.attr('class')).toContain(
        'app-link--underline app-link--text-colour'
      )
    })

    test('Should render with expected custom text', () => {
      expect(logsDashBoardLink.text().trim()).toBe('logs')
    })
  })
})
