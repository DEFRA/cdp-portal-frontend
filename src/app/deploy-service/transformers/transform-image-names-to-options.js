import { blankOption } from '~/src/app/common/helpers/blank-option'

function transformImageNamesToOptions(imageNames) {
  return [
    blankOption,
    ...imageNames.map((imageName) => ({
      text: imageName,
      value: imageName
    }))
  ]
}

export { transformImageNamesToOptions }
