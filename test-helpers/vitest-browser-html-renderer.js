import { page, utils } from 'vitest/browser'
import { beforeEach } from 'vitest'

const { debug, getElementLocatorSelectors } = utils

const containers = new Set()

export function render(
  html,
  {
    baseElement = document.body,
    container = baseElement.appendChild(document.createElement('div'))
  } = {}
) {
  containers.add(container)

  container.innerHTML = html?.trim()

  return Promise.resolve({
    get element() {
      return container.firstChild
    },
    container,
    baseElement,
    debug,
    unmount() {
      containers.delete(container)
      container.remove()
    },
    rerender(newHtml) {
      containers.innerHTML = newHtml
    },
    asFragment() {
      return document
        .createRange()
        .createContextualFragment(container.innerHTML)
    },
    ...getElementLocatorSelectors(container)
  })
}

export function cleanup() {
  for (const container of containers) {
    container.remove()
  }
  containers.clear()
}

page.extend({
  render,
  [Symbol.for('vitest:component-cleanup')]: cleanup
})

beforeEach(() => {
  cleanup()
})
