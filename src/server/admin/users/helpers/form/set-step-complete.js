import { sessionNames } from '~/src/server/common/constants/session-names'

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
