import { buildNavigation } from '~/src/config/nunjucks/context/build-navigation'
import { appConfig } from '~/src/config'

const appPathPrefix = appConfig.get('appPathPrefix')
const mockRequest = (path = '') => ({ path })

describe('#buildNavigation', () => {
  test('Should provide expected navigation details', () => {
    expect(buildNavigation(mockRequest())).toEqual(
      expect.objectContaining({
        primary: expect.arrayContaining([
          expect.objectContaining({
            text: 'Home',
            url: appPathPrefix,
            isActive: false
          }),
          expect.objectContaining({
            text: 'Services',
            url: `${appPathPrefix}/services`,
            isActive: false
          }),
          expect.objectContaining({
            text: 'Teams',
            url: `${appPathPrefix}/teams`,
            isActive: false
          }),
          expect.objectContaining({
            text: 'Deployments',
            url: `${appPathPrefix}/deployments`,
            isActive: false
          }),
          expect.objectContaining({
            text: 'Running Services',
            url: `${appPathPrefix}/running-services`,
            isActive: false
          })
        ]),
        actions: expect.arrayContaining([
          expect.objectContaining({
            text: 'Deploy Service',
            url: `${appPathPrefix}/deploy-service`,
            isActive: false
          }),
          expect.objectContaining({
            text: 'Create Service',
            url: `${appPathPrefix}/create-service`,
            isActive: false
          })
        ])
      })
    )
  })

  test('Should mark matching url as Active', () => {
    expect(
      buildNavigation(mockRequest(`${appPathPrefix}/running-services`))
    ).toEqual(
      expect.objectContaining({
        primary: expect.arrayContaining([
          expect.objectContaining({
            text: 'Home',
            url: appPathPrefix,
            isActive: false
          }),
          expect.objectContaining({
            text: 'Services',
            url: `${appPathPrefix}/services`,
            isActive: false
          }),
          expect.objectContaining({
            text: 'Teams',
            url: `${appPathPrefix}/teams`,
            isActive: false
          }),
          expect.objectContaining({
            text: 'Deployments',
            url: `${appPathPrefix}/deployments`,
            isActive: false
          }),
          expect.objectContaining({
            text: 'Running Services',
            url: `${appPathPrefix}/running-services`,
            isActive: true
          })
        ]),
        actions: expect.arrayContaining([
          expect.objectContaining({
            text: 'Deploy Service',
            url: `${appPathPrefix}/deploy-service`,
            isActive: false
          }),
          expect.objectContaining({
            text: 'Create Service',
            url: `${appPathPrefix}/create-service`,
            isActive: false
          })
        ])
      })
    )
  })
})
