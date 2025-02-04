const formatter = (locales, currency) =>
  new Intl.NumberFormat(locales, {
    style: 'currency',
    currency
  })

const dollarFormatter = formatter('en-US', 'USD').format

export { dollarFormatter }
