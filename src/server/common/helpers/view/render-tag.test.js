import { renderTag } from '~/src/server/common/helpers/view/render-tag.js'

function setupComponent(params = {}) {
  document.body.innerHTML = renderTag(params)
}

describe('renderTag', () => {
  test('Should render default tag', () => {
    setupComponent({
      text: 'Example Tag'
    })

    const $tag = document.querySelector('[data-testid="govuk-tag"]')

    expect($tag).toBeInTheDocument()
    expect($tag).toHaveTextContent('Example Tag')
    expect($tag).toHaveAttribute('class', 'govuk-tag app-tag')
  })

  test('Should render tag with custom CSS class', () => {
    setupComponent({
      text: 'Fancy Tag',
      classes: ['govuk-tag--green']
    })

    const $tag = document.querySelector('[data-testid="govuk-tag"]')

    expect($tag).toBeInTheDocument()
    expect($tag).toHaveAttribute('class', 'govuk-tag app-tag govuk-tag--green')
  })

  test('Should render tag with custom test id', () => {
    setupComponent({
      text: 'Another Tag',
      classes: ['govuk-tag--green'],
      attributes: { 'data-testid': 'custom-tag' }
    })

    expect(
      document.querySelector('[data-testid="custom-tag"]')
    ).toBeInTheDocument()
  })

  test('Should render tag with loading spinner', () => {
    setupComponent({
      text: 'Different Tag',
      classes: ['govuk-tag--green'],
      isLoading: true
    })

    expect(
      document.querySelector('[data-testid="app-loader"]')
    ).toBeInTheDocument()
  })

  test('Should render tag wrapper with anchor', () => {
    setupComponent({
      text: 'Anchor Tag',
      classes: ['govuk-tag--green'],
      url: 'https://awesome-cakes.com',
      newWindow: true
    })

    const $tag = document.querySelector('[data-testid="govuk-tag"]')

    expect($tag).toHaveTextContent('Anchor Tag')
    expect($tag).toHaveAttribute(
      'class',
      'govuk-tag app-tag govuk-tag--green app-link--without-underline'
    )

    const $link = document.querySelector('[data-testid="app-entity-link"]')

    expect($link).toHaveAttribute('href', 'https://awesome-cakes.com')
    expect($link).toHaveAttribute('class', 'app-link govuk-link')
    expect($link).toHaveAttribute('target', '_blank')
    expect($link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  test('Should provide expected attributes when passed', () => {
    setupComponent({
      text: 'Other attributes',
      attributes: {
        'aria-label': 'No.1 tag',
        'aria-description': 'Great strong tag, the best 💪🏻'
      }
    })

    const $tag = document.querySelector('[data-testid="govuk-tag"]')

    expect($tag).toBeInTheDocument()
    expect($tag).toHaveAttribute('aria-label', 'No.1 tag')
    expect($tag).toHaveAttribute(
      'aria-description',
      'Great strong tag, the best 💪🏻'
    )
  })
})
