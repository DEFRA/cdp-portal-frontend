import Page from '~/user-journey-tests/page-objects/page'

describe('Home Page', () => {
  it('Should display expected page heading', async () => {
    await browser.url('')
    await expect(Page.headingTitle).toBeExisting()
    await expect(Page.headingTitle).toHaveText('Home')
  })

  it('Should display expected page heading caption', async () => {
    await browser.url('')
    await expect(Page.headingCaption).toBeExisting()
    await expect(Page.headingCaption).toHaveText(
      'The place for all doing all the things.'
    )
  })
})
