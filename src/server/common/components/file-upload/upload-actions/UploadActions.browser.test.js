import { test, expect, vi } from 'vitest'
import { page } from 'vitest/browser'

import './UploadActions.js'

test('Renders correctly', async () => {
  const { element, getByRole } = await page.render(
    `<upload-actions>
    </upload-actions>`
  )
  await expect
    .element(getByRole('button', { name: 'Cancel' }))
    .not.toBeInTheDocument()

  element.render()
  await expect
    .element(getByRole('button', { name: 'Cancel' }))
    .toBeInTheDocument()
})

test('Updates when attributes are changed', async () => {
  const { element, getByRole, getByText } = await page.render(
    `<upload-actions>
    </upload-actions>`
  )
  element.setAttribute('data-status', 'complete')
  await expect.element(getByText('Complete')).toBeInTheDocument()

  element.setAttribute('data-status', 'failed')
  await expect.element(getByText('Failed')).toBeInTheDocument()

  element.setAttribute('data-status', 'cancelled')
  await expect
    .element(getByRole('button', { name: 'Restart' }))
    .toBeInTheDocument()
})

test('Dispatched events when button clicked', async () => {
  const { element, getByText } = await page.render(
    `<upload-actions>
    </upload-actions>`
  )
  element.render()
  const mockOnCancel = vi.fn()
  element.addEventListener('cancel', mockOnCancel)
  await getByText('Cancel').click()
  expect(mockOnCancel).toHaveBeenCalled()

  element.setAttribute('data-status', 'cancelled')
  const mockOnRestart = vi.fn()
  element.addEventListener('restart', mockOnRestart)
  await getByText('Restart').click()
  expect(mockOnRestart).toHaveBeenCalled()
})
