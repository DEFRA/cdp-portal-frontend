import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { waitFor } from '@testing-library/dom'

import { populateSelectOptions } from './populate-select-options.js'
import { fetchMemory } from './fetch/select/fetch-memory.js'
import { availableMemoryOptionsFixture } from '../../../__fixtures__/deploy-service/ecs-cpu-to-memory-options-map.js'

describe('#populateSelectOptions', () => {
  let controllerSelect
  let targetSelect
  let loader
  let clientNotification

  beforeEach(() => {
    fetchMock.enableMocks()
    window.cdp = { fetchMemory }

    // Add select controller and target to dom
    document.body.innerHTML = `
        <div data-js="app-client-notifications">
          <p data-js="app-client-notifications-content"
             data-testid="app-banner-content">
          </p>
        </div>
        <div>
          <select name="cpu"
                  data-js="app-select-controller"
                  data-fetcher="fetchMemory"
                  data-target="deploy-memory"
                  data-loader="memory-loader"
                  data-testid="cpu">
            <option value="" disabled selected="true"> - - select - - </option>
            <option value="512">512 (.5 vCPU)</option>
            <option value="1024">1024 (1 vCPU)</option>
          </select>
        </div>
        <div>
          <select name="memory" data-js="deploy-memory" data-testid="deploy-memory"></select>
          <span class="app-loader" data-testid="app-loader" data-js="memory-loader"></span>
        </div>`.trim()

    // Init ClientSide JavaScript
    const selectControllers = Array.from(
      document.querySelectorAll('[data-js="app-select-controller"]')
    )

    if (selectControllers.length) {
      selectControllers.forEach((select) => populateSelectOptions(select))
    }

    controllerSelect = document.querySelector('[data-testid="cpu"]')
    targetSelect = document.querySelector('[data-testid="deploy-memory"]')
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
          Promise.resolve(JSON.stringify(availableMemoryOptionsFixture))
        )

        controllerSelect.focus()
        controllerSelect.value = 'cdp-portal-frontend'

        controllerSelect.dispatchEvent(new Event('change'))
      })

      test('Should populate target select options as expected', async () => {
        await waitFor(() => {
          expect(targetSelect.outerHTML).toEqual(
            `<select name="memory" data-js="deploy-memory" data-testid="deploy-memory">
            <option value="" disabled=""> - - select - - </option>
            <option value="1024">1 GB</option>
            <option value="2048">2 GB</option>
            <option value="3072">3 GB</option>
            <option value="4096">4 GB</option>
          </select>`.replace(/\s\s+/g, '')
          )
        })
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

      test('Should show client error', async () => {
        await waitFor(() => {
          expect(clientNotification).toHaveTextContent(
            'Something terrible has happened!'
          )
        })
      })

      test('Loader should not be spinning', () => {
        expect(loader).not.toHaveClass('app-loader--is-loading')
      })
    })
  })
})
