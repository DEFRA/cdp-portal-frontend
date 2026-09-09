const accountDisabledController = {
  options: {
    auth: {
      mode: 'try'
    }
  },
  handler: async (request, h) =>
    h.view('account-disabled/view', {
      pageTitle: 'Account disabled',
      heading: 'Your account has been disabled',
      message:
        'Your Portal account has been disabled due to inactivity. Please contact the Platform team to re-enable your account.'
    })
}

export { accountDisabledController }
