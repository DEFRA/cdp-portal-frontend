import { defaultOption } from '~/src/server/common/helpers/options/default-option.js'

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
