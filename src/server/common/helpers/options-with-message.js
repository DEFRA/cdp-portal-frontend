import { blankOption } from '~/src/server/common/helpers/blank-option'

function optionsWithMessage(message) {
  return [
    blankOption,
    {
      attributes: { disabled: true },
      text: message,
      value: ''
    }
  ]
}

export { optionsWithMessage }
