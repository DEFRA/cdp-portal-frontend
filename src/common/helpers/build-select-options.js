import { blankOption } from '~/src/app/common/helpers/blank-option'

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
