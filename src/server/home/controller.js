const homeController = {
  options: {
    id: 'home'
  },
  handler: (request, h) =>
    h.view('home/index', {
      pageTitle: 'Home',
      heading: 'Welcome'
    })
}

export { homeController }
