import fetchMock from 'jest-fetch-mock'

import { populateSelectOptions } from '~/src/client/common/helpers/populate-select-options'
import { availableVersionsOptionsFixture } from '~/src/__fixtures__/available-versions'
import { fetchVersions } from '~/src/client/common/helpers/fetch/select'

describe('#populateSelectOptions', () => {
  let controllerSelect
  let targetSelect
  let loader
  let clientNotification

  beforeEach(() => {
    fetchMock.enableMocks()
    window.cdp = { fetchVersions }

    // Add select controller and target to dom
    document.body.innerHTML = `
        <div data-js="app-client-notifications">
          <p data-js="app-client-notifications-content"
             data-testid="app-banner-content">
          </p>
        </div>
        <div>
          <select name="imageName"
                  data-js="app-select-controller"
                  data-fetcher="fetchVersions"
                  data-target="deploy-version"
                  data-loader="version-loader"
                  data-testid="image-name">
            <option value="" disabled selected="true"> - - select - - </option>
            <option value="cdp-portal-frontend">cdp-portal-frontend</option>
            <option value="cdp-user-service-backend">cdp-user-service-backend</option>
          </select>
        </div>
        <div>
          <select name="version" data-js="deploy-version" data-testid="version"></select>
          <span class="app-loader" data-testid="app-loader" data-js="version-loader"></span>
        </div>`.trim()

    // Init ClientSide JavaScript
    const selectControllers = Array.from(
      document.querySelectorAll('[data-js="app-select-controller"]')
    )

    if (selectControllers.length) {
      selectControllers.forEach((select) => populateSelectOptions(select))
    }

    controllerSelect = document.querySelector('[data-testid="image-name"]')
    targetSelect = document.querySelector('[data-testid="version"]')
    loader = document.querySelector('[data-testid="app-loader"]')
    clientNotification = document.querySelector(
      '[data-testid="app-banner-content"]'
    )
  })

  afterEach(() => {
    fetchMock.disableMocks()

    delete window.cdp
  })

  describe('With response', () => {
    describe('When option is chosen in controller select', () => {
      beforeEach(() => {
        fetch.mockResponse(() =>
          Promise.resolve(JSON.stringify(availableVersionsOptionsFixture))
        )

        controllerSelect.focus()
        controllerSelect.value = 'cdp-portal-frontend'

        controllerSelect.dispatchEvent(new Event('change'))
      })

      test('Should populate target select options as expected', () => {
        expect(targetSelect.outerHTML).toEqual(
          `<select name="version" data-js="deploy-version" data-testid="version">
             <option value="" disabled=""> - - select - - </option>
             <option value="0.87.0">0.87.0</option>
             <option value="0.86.0">0.86.0</option>
             <option value="0.85.0">0.85.0</option>
             <option value="0.84.0">0.84.0</option>
           </select>`.replace(/\s\s+/g, '')
        )
      })
    })
  })

  describe('With error response', () => {
    describe('When option is chosen in controller select', () => {
      beforeEach(() => {
        fetch.mockResponse(() =>
          Promise.reject(Error('Something terrible has happened!'))
        )

        controllerSelect.focus()
        controllerSelect.value = 'cdp-portal-frontend'

        controllerSelect.dispatchEvent(new Event('change'))
      })

      test('Should show client error', () => {
        expect(clientNotification.textContent).toEqual(
          'Something terrible has happened!'
        )
      })

      test('Loader should not be spinning', () => {
        expect(loader.classList.contains('app-loader--is-loading')).toEqual(
          false
        )
      })
    })
  })
})
