import { blankOption } from '~/src/server/common/helpers/blank-option'

// TODO rename this to buildOptions
function buildSelectOptions(items, withBlank = true) {
  return [
    ...(withBlank ? [blankOption] : []),
    ...items.map((item) => {
      if (item?.value && item?.text) {
        return { value: item.value, text: item.text }
      }

      return { value: item, text: item }
    })
  ]
}

export { buildSelectOptions }
