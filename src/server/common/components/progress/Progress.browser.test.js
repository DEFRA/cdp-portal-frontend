import { test } from 'vitest'
import { page } from 'vitest/browser'

import './Progress.js'

test('Renders correctly', async () => {
  const { element, getByText } = await page.render(
    `<app-progress
      data-total="100"
      data-complete="50"
      data-progress="50"
    >
    </app-progress>`
  )
  await expect.element(getByText('50 / 100')).not.toBeInTheDocument()

  element.render()
  await expect.element(getByText('50 / 100')).toBeInTheDocument()
})

test('Updates when attributes are changed', async () => {
  const { element, getByText } = await page.render(
    `<app-progress
      data-total="100"
      data-complete="50"
      data-progress="50"
    >
    </app-progress>`
  )
  element.setAttribute('data-complete', 80)
  await expect.element(getByText('80 / 100')).toBeInTheDocument()

  element.setAttribute('data-total', 200)
  await expect.element(getByText('80 / 200')).toBeInTheDocument()
})
