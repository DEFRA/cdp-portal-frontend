class Page {
  get headingTitle() {
    return browser.$('[data-testid="app-heading-title"]')
  }

  get headingCaption() {
    return browser.$('[data-testid="app-heading-caption"]')
  }
}

export default new Page()
