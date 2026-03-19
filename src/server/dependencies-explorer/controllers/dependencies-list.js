export default {
  options: {
    id: 'dependencies-explorer'
  },
  handler: async (request, h) => {
    return h.view('dependencies-explorer/views/dependencies-list', {
      pageTitle: 'Dependencies Explorer'
    })
  }
}
