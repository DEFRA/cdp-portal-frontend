import pickBy from 'lodash/pickBy.js'
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
      const value = item?.value
      const text = item?.text
      const html = item?.html
      const hint = item?.hint
      const label = item?.label

      if (value && text) {
        return pickBy({ value, text, hint, label })
      }

      if (value && html) {
        return pickBy({ value, html, hint, label })
      }

      return { value: item, text: item }
    })
  ]
}

export { buildOptions }
