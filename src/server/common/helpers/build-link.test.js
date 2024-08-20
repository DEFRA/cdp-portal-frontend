import { buildLink } from '~/src/server/common/helpers/build-link'

describe('#buildLink', () => {
  test('Should build expected link', () => {
    expect(buildLink('https://awesome-cakes.com', 'AweSome Cakes')).toBe(
      `<a class="app-link" href="https://awesome-cakes.com" target="_blank" rel="noopener noreferrer">AweSome Cakes</a>`
    )
  })

  test('Should build expected link for same page', () => {
    expect(buildLink('#awesome-cakes', 'In page link to AweSome Cakes')).toBe(
      `<a class="app-link" href="#awesome-cakes" target="_blank" rel="noopener noreferrer">In page link to AweSome Cakes</a>`
    )
  })
})
