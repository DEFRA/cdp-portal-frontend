import { test, expect, vi, beforeAll, afterEach, afterAll } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { http, HttpResponse } from 'msw'
import { setupWorker } from 'msw/browser'

import './Typeahead.js'

// Set up MSW worker with API handlers
const worker = setupWorker(
  http.get('/api/suggestions', ({ request }) => {
    const url = new URL(request.url)
    const userText = url.searchParams.get('user_text').toLowerCase()

    return HttpResponse.html(`
      <ul
        class="app-typeahead__suggestions app-typeahead__suggestions--show"
        id="app-typeahead-user-suggestions"
        aria-labelledby="user-label"
        aria-expanded="true"
        role="listbox"
        data-testid="app-autocomplete-suggestions"
      >
        ${
          'robocop'.includes(userText)
            ? `<li
          class="app-typeahead__suggestion"
          role="option"
          tabindex="-1"
          id="app-typeahead--suggestion-1"
          aria-posinset="1"
          aria-setsize="3"
          aria-selected="false"
        >
          <label class="app-suggestion__value">
            <input
              type="radio"
              name="app-typeahead--option"
              value="robo_cop"
              class="app-typeahead__option"
            />
            RoboCop
          </label>

          <span class="app-suggestion__action"> </span>
        </li>`
            : ''
        }
        ${
          'roger rabbit'.includes(userText)
            ? `<li
          class="app-typeahead__suggestion"
          role="option"
          tabindex="-1"
          id="app-typeahead--suggestion-2"
          aria-posinset="2"
          aria-setsize="3"
          aria-selected="false"
        >
          <label class="app-suggestion__value">
            <input
              type="radio"
              name="app-typeahead--option"
              value="roger_rabbit"
              class="app-typeahead__option"
            />
            Roger Rabbit
          </label>

          <span class="app-suggestion__action"> </span>
        </li>`
            : ''
        }
        ${
          'barbie'.includes(userText)
            ? `<li
          class="app-typeahead__suggestion"
          role="option"
          tabindex="-1"
          id="app-typeahead--suggestion-3"
          aria-posinset="3"
          aria-setsize="3"
          aria-selected="false"
        >
          <label class="app-suggestion__value">
            <input
              type="radio"
              name="app-typeahead--option"
              value="barbie"
              class="app-typeahead__option"
            />
            Barbie
          </label>

          <span class="app-suggestion__action"> </span>
        </li>`
            : ''
        }
      </ul>
    `)
  })
)
beforeAll(() => worker.start())
afterEach(() => worker.resetHandlers())
// afterAll(() => worker.stop())

const component = `
  <app-typeahead data-id="user" data-name="user">
      <div
          id="app-typeahead-user"
          class="govuk-form-group app-form-group"
          data-js="app-form-group"
          data-testid="app-autocomplete-group"
      >
          <label
              class="govuk-label"
              id="user-label"
              for="user"
              data-testid="app-autocomplete-label"
          >
              By
          </label>

          <div class="govuk-hint app-hint" data-testid="app-autocomplete-hint">
              Choose a user
          </div>

          <div class="app-typeahead" data-testid="app-autocomplete">
              <div class="app-typeahead__control">
                  <input
                      id="user"
                      type="text"
                      value=""
                      class="govuk-input app-typeahead__input js-hidden"
                      placeholder=" - - select - - "
                      data-testid="app-progressive-input"
                      autocapitalize="none"
                      combobox="off"
                      data-1p-ignore=""
                      data-lpignore="true"
                      autocomplete="off"
                  />

                  <input
                      id="app-typeahead-user-input"
                      name="user_text"
                      type="text"
                      value=""
                      class="govuk-input app-typeahead__input js-visible"
                      placeholder=" - - select - - "
                      autocapitalize="none"
                      combobox="off"
                      role="combobox"
                      aria-controls="app-typeahead-user-suggestions"
                      aria-combobox="list"
                      aria-expanded="false"
                      data-1p-ignore=""
                      data-lpignore="true"
                      autocomplete="off"
                      data-hx-get="/api/suggestions"
                      data-hx-trigger="input changed delay:200ms, focus"
                      data-hx-target="#app-typeahead-user-suggestions"
                      data-hx-swap="outerSync"
                      data-hx-include="#user"
                      data-htmx-powered="true"
                  />

                  <button
                      id="app-typeahead-user-chevron-button"
                      class="app-typeahead__chevron-button js-visible"
                      type="button"
                      tabindex="-1"
                      aria-owns="app-typeahead-user-suggestions"
                      aria-label="Show"
                      data-testid="app-chevron-button"
                      aria-lable="Show"
                  >
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="app-icon app-chevron-icon"
                          width="40"
                          height="40"
                          viewBox="0 -960 960 960"
                          role="img"
                          aria-label="Chevron"
                      >
                          <path
                              d="M480-331.667 226.667-585 287-645.333l193 194.334 193.667-193.667 59.666 60.333L480-331.667Z"
                          ></path>
                      </svg>
                  </button>

                  <button
                      id="app-typeahead-user-clear-button"
                      class="app-typeahead__clear-button"
                      type="button"
                      tabindex="-1"
                      data-testid="app-autocomplete-clear-button"
                  >
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="app-cancel-icon"
                          width="48"
                          height="48"
                          viewBox="0 -960 960 960"
                          role="img"
                          aria-label="Clear"
                      >
                          <path
                              d="m338-290 142-142 142 142 48-48-142-142 142-142-48-48-142 142-142-142-48 48 142 142-142 142 48 48ZM479.679-59q-86.319 0-163.646-32.604-77.328-32.603-134.577-89.852-57.249-57.249-89.852-134.57Q59-393.346 59-479.862q0-87.41 32.662-164.275 32.663-76.865 90.042-134.438 57.378-57.574 134.411-90.499Q393.147-902 479.336-902q87.55 0 164.839 32.848 77.288 32.849 134.569 90.303 57.281 57.454 90.269 134.523Q902-567.257 902-479.458q0 86.734-32.926 163.544-32.925 76.809-90.499 134.199-57.573 57.39-134.447 90.053Q567.255-59 479.679-59Z"
                          ></path>
                      </svg>
                  </button>
              </div>

              <ul
                  class="app-typeahead__suggestions"
                  id="app-typeahead-user-suggestions"
                  aria-labelledby="user-label"
                  aria-expanded="false"
                  role="listbox"
                  data-testid="app-autocomplete-suggestions"
              ></ul>
          </div>
      </div>
  </app-typeahead>
`

test('Renders correctly', async () => {
  const { getByRole } = await page.render(component)

  await expect.element(getByRole('combobox')).toBeInTheDocument()
})

test('Dispatches change event on option click', async () => {
  const { element, getByRole, getById } = await page.render(component)
  const input = getByRole('combobox')
  const suggestions = getByRole('listbox')

  const onChange = vi.fn()
  element.addEventListener('change', onChange)

  await input.click()

  await expect.element(suggestions).toHaveAttribute('aria-expanded', 'true')

  await suggestions.getByText('RoboCop').click()

  await expect.element(getById('user')).toHaveValue('robo_cop')
  expect(onChange).toHaveBeenCalled()
})

test('Dispatches change event on option enter key', async () => {
  const { element, getByRole, getById } = await page.render(component)
  const input = getByRole('combobox')
  const suggestions = getByRole('listbox')

  const onChange = vi.fn()
  element.addEventListener('change', onChange)

  await input.click()

  await expect.element(suggestions).toHaveAttribute('aria-expanded', 'true')

  await userEvent.keyboard('{ArrowDown}') // first option
  await userEvent.keyboard('{ArrowDown}') // second option
  await userEvent.keyboard('{Enter}')

  await expect.element(getById('user')).toHaveValue('roger_rabbit')
  expect(onChange).toHaveBeenCalled()
})

test('Dispatches change event on clear button click', async () => {
  const { element, getByRole, getById, getByLabelText } =
    await page.render(component)
  const input = getByRole('combobox')
  const suggestions = getByRole('listbox')

  await input.click()

  await expect.element(suggestions).toHaveAttribute('aria-expanded', 'true')

  await userEvent.keyboard('{ArrowDown}')
  await userEvent.keyboard('{Enter}')

  await expect.element(getById('user')).toHaveValue('robo_cop')

  const onChange = vi.fn()
  element.addEventListener('change', onChange)

  await getByLabelText('Clear').click()

  await expect.element(getById('user')).toHaveValue('')
  expect(onChange).toHaveBeenCalled()
})

test('Filters options by input text', async () => {
  const { getByRole } = await page.render(component)
  const input = getByRole('combobox')
  const suggestions = getByRole('listbox')

  await input.click()
  await expect.element(suggestions).toHaveAttribute('aria-expanded', 'true')
  expect(suggestions.getByRole('option')).toHaveLength(3)

  await input.fill('Ro')
  expect.element(suggestions.getByRole('option')).toHaveLength(2)

  await input.fill('Rob')
  expect.element(suggestions.getByRole('option')).toHaveLength(1)

  await input.fill('Robx')
  expect.element(suggestions.getByRole('option')).toHaveLength(1)
  await expect
    .element(suggestions.getByText('- - no results - -'))
    .toBeInTheDocument()
})
