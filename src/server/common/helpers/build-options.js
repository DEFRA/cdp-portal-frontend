import { defaultOption } from '~/src/server/common/helpers/default-option'

function buildOptions(items, withDefault = true) {
  return [
    ...(withDefault ? [defaultOption] : []),
    ...items.map((item) => {
      if (item?.value && item?.text) {
        return { value: item.value, text: item.text }
      }

      return { value: item, text: item }
    })
  ]
}

export { buildOptions }
