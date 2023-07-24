import { appConfig } from '~/src/config'

const startDeployServiceController = {
  handler: (request, h) => {
    request.yar.clear('deployment')
    request.yar.clear('validationFailure')
    request.yar.commit(h)

    return h.redirect(
      `${appConfig.get('appPathPrefix')}/deploy-service/details`
    )
  }
}

export { startDeployServiceController }
