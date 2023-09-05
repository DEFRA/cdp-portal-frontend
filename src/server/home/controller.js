const homeController = {
  handler: (request, h) => {
    const auth = request.yar.get('auth')

    if (typeof auth !== 'undefined' && auth !== null && auth.isAuthenticated) {
      return h.view('home/index', {
        pageTitle: 'Home',
        heading: 'Welcome ' + auth.credentials.profile.displayName
      })
    } else {
      return h.view('home/index', {
        pageTitle: 'Home',
        heading: 'Welcome'
      })
    }
  }
}

export { homeController }
