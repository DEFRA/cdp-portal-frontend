// TODO handle multiples on same page?
// tODO split out to helpers
// TODO naming isn't quite right
// TODO fix this up
/*
AutoComplete
Menu
Message

 */

// function resultsMessage(amount) {
//   return `${amount} results available.`
// }

function buildOption(inputValue, currentSelection) {
  return (item, index) => {
    const li = document.createElement('li')

    li.setAttribute('role', 'option')
    li.setAttribute('tabindex', '-1')
    li.setAttribute('ariaSelected', 'false')
    li.setAttribute('data-value', item.value)

    if (inputValue) {
      li.innerHTML = item.value.replace(
        new RegExp(inputValue, 'gi'),
        `<strong>$&</strong>`
      )
    } else {
      li.textContent = item.value
    }

    if (currentSelection === index) {
      li.classList.add('highlight')
    }

    return li
  }
}

function search($module) {
  if (!$module) {
    return
  }

  const searchItems = window.searchItems ?? []
  const itemsHolder = document.querySelector('#app-search__items')
  // const searchResults = document.querySelector('#app-search__result')

  let currentSelection = -1

  $module.addEventListener('focus', () => {
    const allItems = searchItems.map(buildOption())

    itemsHolder.replaceChildren(...allItems)
    // searchResults.textContent = resultsMessage(allItems.length)
  })

  $module.addEventListener('blur', () => {
    // itemsHolder.replaceChildren()
    // searchResults.textContent = '' // TODO do this in a better way
  })

  $module.addEventListener('input', (event) => {
    const inputValue = event?.target?.value

    const items = searchItems
      .filter((item) => item.value.includes(inputValue))
      .map(buildOption(inputValue))

    itemsHolder.replaceChildren(...items)
    currentSelection = -1
    // searchResults.textContent = resultsMessage(items.length) // TODO do we need this?
  })

  $module.addEventListener('keyup', (event) => {
    const keyCode = event.code.toLowerCase()
    const inputValue = event?.target?.value

    if (keyCode === 'escape') {
      // TODO better way of clearing down autocomplete
      itemsHolder.replaceChildren()
      // searchResults.textContent = ''
    }

    if (keyCode === 'arrowup') {
      currentSelection--

      if (currentSelection < 0) {
        currentSelection = searchItems.length - 1
      }
    }

    if (keyCode === 'arrowdown') {
      currentSelection++

      if (currentSelection > searchItems.length - 1) {
        currentSelection = 0
      }
    }

    if (keyCode === 'arrowup' || keyCode === 'arrowdown') {
      const items = searchItems
        .filter((item) => item.value.includes(inputValue))
        .map(buildOption(inputValue, currentSelection))

      itemsHolder.replaceChildren(...items)

      const itemsArray = Array.from(items)

      const currentItem = itemsArray.at(currentSelection)
      const currentRectangle = currentItem.getBoundingClientRect()

      const resultsViewportRectangle = itemsHolder.getBoundingClientRect()

      console.log(
        'resultsViewportRectangle.bottom',
        resultsViewportRectangle.bottom,
        'resultsViewportRectangle.height',
        resultsViewportRectangle.height,
        'currentRectangle.height',
        currentRectangle.height,
        'currentRectangle.top',
        currentRectangle.top
      )

      console.log('-------------------------------')

      // itemsHolder.scroll(0, currentRectangle.height * currentSelection)
    }

    if (keyCode === 'enter') {
      const urlParams = new URLSearchParams(window.location.search)

      const resultItems = Array.from(
        document.querySelectorAll('#app-search__items > li')
      )

      const selectedItem = resultItems?.at(currentSelection)

      // console.log(resultItems, selectedItem, currentSelection)

      urlParams.set('deployment', selectedItem.getAttribute('data-value'))

      window.location.search = urlParams
    }

    // console.log('currentSelection', currentSelection)
  })

  const results = document.querySelector('#app-search__items')

  results.addEventListener('click', (event) => {
    if (event?.target?.tagName === 'LI') {
      const urlParams = new URLSearchParams(window.location.search)
      urlParams.set('deployment', event?.target?.getAttribute('data-value'))
      window.location.search = urlParams
    }
  })
}

export { search }
