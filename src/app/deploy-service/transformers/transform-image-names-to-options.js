import { startCase } from 'lodash'

import { blankOption } from '~/src/common/helpers/blank-option'

function transformImageNamesToOptions(imageNames) {
  return [
    blankOption,
    ...imageNames.map((imageName) => ({
      text: startCase(imageName),
      value: imageName
    }))
  ]
}

export { transformImageNamesToOptions }
