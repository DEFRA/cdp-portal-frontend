import { sessionNames } from '~/src/server/common/constants/session-names'

function setStepComplete({ yar }, step) {
  const key = sessionNames.cdpUser
  const cdpUser = yar.get(key)

  yar.set(key, {
    ...cdpUser,
    ...{
      isComplete: {
        ...(cdpUser.isComplete ? cdpUser.isComplete : {}),
        [step]: true
      }
    }
  })
}

export { setStepComplete }
