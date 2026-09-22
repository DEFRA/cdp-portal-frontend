import { test, expect, vi } from 'vitest'
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
  window.cdp.uploadManager.getUploads = vi.fn().mockReturnValue(null)
  element.render()

  await expect
    .element(getByRole('button', { name: 'Upload' }))
    .toBeInTheDocument()
})

test('Prompts to select at least one file', async () => {
  const { element, getByRole, getByText } = await page.render(component)
  window.cdp.uploadManager.getUploads = vi.fn().mockReturnValue([])
  element.render()

  await getByRole('button', { name: 'Upload' }).click()

  await expect
    .element(getByText('Error: Please select at least one file.'))
    .toBeInTheDocument()
})

test('Intercepts submit and starts the upload', async () => {
  const { element, getByRole } = await page.render(component)
  window.cdp.uploadManager.getUploads = vi.fn().mockReturnValue(null)
  element.render()

  window.cdp.uploadManager.startUpload = vi.fn()

  await getByRole('button').first().upload('./README.md')

  await getByRole('button', { name: 'Upload' }).click()
  expect(window.cdp.uploadManager.startUpload).toHaveBeenCalled()
})

test('Renders upload progress', async () => {
  const { element, getByText } = await page.render(component)
  window.cdp.uploadManager.getUploads = vi.fn().mockReturnValue([
    {
      name: 'README.MD',
      size: 3000,
      bytesUploaded: 2000,
      progress: 75
    }
  ])
  element.render()

  await expect.element(getByText('README.MD')).toBeInTheDocument()
})
