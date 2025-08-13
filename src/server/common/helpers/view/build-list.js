const buildList = ({ items, classes = [] }) => {
  const listClasses = ['govuk-list']

  if (classes) {
    listClasses.push(...classes)
  }

  const list = `<ul class="${listClasses.join(' ')}">`

  return items.reduce((acc, item) => acc + `<li>${item}</li>`, list) + '</ul>'
}

export { buildList }
