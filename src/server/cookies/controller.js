const cookiesController = {
  options: {
    id: 'cookies'
  },
  handler: (request, h) =>
    h.view('cookies/index', {
      pageTitle: 'Cookies',
      heading: 'Cookies'
    })
}

export { cookiesController }
