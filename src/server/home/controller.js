const homeController = {
  options: {
    id: 'home'
  },
  handler: (request, h) =>
    h.view('home/views/home', {
      pageTitle: 'Home',
      heading: 'Welcome'
    })
}

export { homeController }
