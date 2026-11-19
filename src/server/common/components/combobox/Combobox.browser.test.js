import { test, expect, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'

import './Combobox.js'

const component = `
  <app-combobox
      data-id="user"
      data-name="user"
      data-value=""
      data-classes=""
      data-label-text="By"
      data-label-classes=""
      data-hint-text="Choose a user"
      data-hint-html=""
      data-formgroup-classes=""
      data-icon=""
  >
      <div
          id="app-autocomplete-user"
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

          <div class="app-combobox" data-testid="app-autocomplete">
              <div class="app-combobox__control">
                  <select
                      id="user"
                      class="govuk-select app-select js-hidden"
                      data-testid="app-progressive-input"
                  >
                      <option value="" selected="selected">- - select - -</option>
                      <option value="RoboCop">RoboCop</option>
                      <option value="Roger Rabbit">Roger Rabbit</option>
                      <option value="Barbie">Barbie</option>
                  </select>

                  <input
                      id="user-input"
                      type="text"
                      value=""
                      class="govuk-input app-combobox__input js-visible"
                      placeholder=" - - select - - "
                      autocapitalize="none"
                      combobox="off"
                      role="combobox"
                      aria-controls="app-combobox-user-suggestions"
                      aria-combobox="list"
                      aria-expanded="false"
                      data-1p-ignore=""
                      data-lpignore="true"
                      autocomplete="off"
                  />

                  <button
                      id="app-combobox-user-chevron-button"
                      class="app-combobox__chevron-button js-visible"
                      type="button"
                      tabindex="-1"
                      aria-owns="app-combobox-user-suggestions"
                      aria-label="Show"
                      data-testid="app-chevron-button"
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
                      id="app-combobox-user-clear-button"
                      class="app-combobox__clear-button"
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
                  class="app-combobox__suggestions"
                  id="app-combobox-user-suggestions"
                  aria-labelledby="user-label"
                  aria-expanded="false"
                  role="listbox"
                  data-testid="app-autocomplete-suggestions"
              ></ul>
          </div>
      </div>
  </app-combobox>
`

test('Renders correctly', async () => {
  const { element, getByRole } = await page.render(component)
  element.render()

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

  await expect.element(getById('user')).toHaveValue('RoboCop')
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

  await expect.element(getById('user')).toHaveValue('Roger Rabbit')
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

  await expect.element(getById('user')).toHaveValue('RoboCop')

  const onChange = vi.fn()
  element.addEventListener('change', onChange)

  await getByLabelText('Clear').click()

  await expect.element(getById('user')).toHaveValue('')
  expect(onChange).toHaveBeenCalled()
})
