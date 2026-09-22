import { test, expect } from 'vitest'
import { page } from 'vitest/browser'

import './FileUpload.js'

const component = `
<app-file-upload
  data-path="test"
  data-service="test-service"
  data-csrftoken="1234">
</app-file-upload>`

test('Renders correctly', async () => {
  const { element, getByRole } = await page.render(component)
  element.render()

  await expect
    .element(getByRole('button', { name: 'Upload' }))
    .toBeInTheDocument()
})

test('Prompts to select at least one file', async () => {
  const { element, getByRole, getByText } = await page.render(component)
  element.render()

  await getByRole('button', { name: 'Upload' }).click()

  await expect
    .element(getByText('Please select at least one file.'))
    .toBeInTheDocument()
})
