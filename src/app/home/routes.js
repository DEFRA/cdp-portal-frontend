const home = {
  method: 'GET',
  path: '/',
  options: {
    handler: (request, h) => {
      return h.view('home/index')
    }
  }
}

export { home }
