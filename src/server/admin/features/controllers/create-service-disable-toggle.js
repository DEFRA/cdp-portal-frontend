const enableCreateServiceDisabledToggleController = {
  handler: (request, h) => {
    request.logger('Create service disabled toggle enabled')
    // TODO: Implement feature toggle logic
    return h.redirect(`/admin/features`)
  }
}

const expireCreateServiceDisabledToggleController = {
  handler: (request, h) => {
    request.logger('Create service disabled toggle expired')
    // TODO: Implement feature toggle logic
    return h.redirect(`/admin/features`)
  }
}

export {
  enableCreateServiceDisabledToggleController,
  expireCreateServiceDisabledToggleController
}
