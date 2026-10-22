import { test, expect } from 'vitest'
import { page } from 'vitest/browser'

import diagram from './diagram.html?raw'

test('Renders diagram correctly', async () => {
  await page.viewport(1280, 1024)
  const { container } = await page.render(diagram)
  window._mermaidRun()

  await expect(container.firstChild).toMatchScreenshot()
})
