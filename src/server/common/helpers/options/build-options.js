import { defaultOption } from './default-option.js'

/**
 * Build select, radio or checkbox options
 * @param {Array<{value: string, text: string}> | Array<string>} items
 * @param {boolean} withDefault
 * @returns {Array<{value: string, text: string, disabled: boolean, attributes: {selected: boolean}}>}
 */
function buildOptions(items, withDefault = true) {
  return [
    ...(withDefault ? [defaultOption] : []),
    ...items.map((item) => {
      if (item?.value && item?.text) {
        return { value: item.value, text: item.text }
      }

      if (item?.value && item?.html) {
        return { value: item.value, html: item.html }
      }

      return { value: item, text: item }
    })
  ]
}

export { buildOptions }
