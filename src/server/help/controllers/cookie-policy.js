const cookiePolicy = {
  options: {
    id: 'help/cookies'
  },
  handler: (_request, h) =>
    h.view('help/views/cookie-policy', {
      pageTitle: 'Cookie policy',
      heading: 'Cookie policy'
    })
}

export { cookiePolicy }
