const accountDisabledController = {
  options: {
    auth: {
      mode: 'try'
    }
  },
  handler: async (_request, h) =>
    h.view('account-disabled/view', {
      pageTitle: 'Account disabled',
      heading: 'Your account has been disabled',
      message: 'Your Portal account has been disabled due to inactivity.'
    })
}

export { accountDisabledController }
