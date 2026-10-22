import { test, expect } from 'vitest'
import { page } from 'vitest/browser'

import diagram from './diagram.html?raw'

test('Renders diagram correctly', async () => {
  const { container } = await page.render(diagram)
  window._mermaidRun()

  await expect(container.firstChild).toMatchScreenshot()
})
