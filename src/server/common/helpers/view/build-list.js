const buildList = (items) => {
  const list = '<ul class="govuk-list">'

  return items.reduce((acc, item) => acc + `<li>${item}</li>`, list) + '</ul>'
}

export { buildList }
