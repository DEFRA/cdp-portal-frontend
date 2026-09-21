import { test } from 'vitest'
import { page } from 'vitest/browser'

import Progress from './Progress.js'

test('Renders correctly', async () => {
  // const screen = page.render(`<button>Hello</button>`)
  const container = document.createElement('div')
  document.body.appendChild(container)
  container.innerHTML = '<app-progress></app-progress><button>Hello</button>'

  container.firstChild.setAttribute('data-progress', 50)
  container.firstChild.setAttribute('data-complete', 50)
  container.firstChild.setAttribute('data-total', 100)
  // page.debug()
  // await expect.element(page).toBeVisible()
  await expect
    .element(page.getByRole('button', { name: /Hello/i }))
    .toBeInTheDocument()
})
