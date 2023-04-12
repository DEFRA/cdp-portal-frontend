const about = {
  method: 'GET',
  path: '/about',
  options: {
    handler: (request, h) => {
      return h.view('about/index', { pageTitle: 'About' })
    }
  }
}

module.exports = {
  about
}
