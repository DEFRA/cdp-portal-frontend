import { test } from 'vitest'
import { page } from 'vitest/browser'

import Progress from './Progress.js'

test('Renders correctly', async () => {
  const { container, debug, getByText } = await page.render(
    `<app-progress></app-progress>`
  )
  container.firstChild.setAttribute('data-progress', 50)
  container.firstChild.setAttribute('data-complete', 50)
  container.firstChild.setAttribute('data-total', 100)

  debug()

  await expect.element(getByText('50 / 100')).toBeInTheDocument()
})
