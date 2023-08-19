import { isUndefined } from 'lodash'

function isCdpUserComplete(cdpUser) {
  return {
    stepOne: cdpUser?.email && cdpUser?.userId,
    stepTwo: !isUndefined(cdpUser?.github),
    stepThree:
      !isUndefined(cdpUser?.name) &&
      !isUndefined(cdpUser?.defraAwsId) &&
      !isUndefined(cdpUser?.defraVpnId),
    stepFour: cdpUser?.isComplete
  }
}

export { isCdpUserComplete }
