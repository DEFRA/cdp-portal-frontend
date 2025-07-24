import { sessionNames } from '../../../../common/constants/session-names.js'

async function setStepComplete(
  { yar },
  h,
  step,
  cdpUser = yar.get(sessionNames.cdpUser)
) {
  yar.set(sessionNames.cdpUser, {
    ...cdpUser,
    ...{
      isComplete: {
        ...(cdpUser.isComplete ? cdpUser.isComplete : {}),
        [step]: true
      }
    }
  })

  await yar.commit(h)
}

export { setStepComplete }
