import { isFunction } from 'lodash'

import { buildSelectOptions } from '~/src/common/helpers/build-select-options'

const fetchVersion = async function fetchVersion(value) {
  try {
    const response = await fetch(
      `deploy-service/available-versions?serviceName=${value}`
    )
    const versions = await response.json()

    return buildSelectOptions(versions, false)
  } catch (error) {
    throw new Error(error)
  }
}

const dataFetchers = {
  fetchVersion
}

function populateSelectOptions($controller) {
  if (!$controller) {
    return
  }

  const $target = document.querySelector(
    `[data-js="${$controller.getAttribute('data-target')}"]`
  )
  const dataFetcherName = $controller.getAttribute('data-fetcher')
  const dataFetcher = dataFetchers[dataFetcherName]

  if (!$target && !isFunction(dataFetcher)) {
    return
  }

  const blankOption = new Option('', '')
  blankOption.hidden = true

  $controller.addEventListener('change', async (event) => {
    const value = event?.target?.value

    // remove all version options from select element
    Array.from($target?.options).forEach((option) => option.remove())

    const versions = await dataFetcher(value)

    const optionsWithPrependedBlank = [
      blankOption,
      ...versions.map((version) => new Option(version.text, version.value))
    ]

    optionsWithPrependedBlank.forEach((option) => $target.add(option))
  })
}

export { populateSelectOptions }
