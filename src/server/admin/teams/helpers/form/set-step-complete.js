import { sessionNames } from '~/src/server/common/constants/session-names.js'

async function setStepComplete(
  { yar },
  h,
  step,
  cdpTeam = yar.get(sessionNames.cdpTeam)
) {
  yar.set(sessionNames.cdpTeam, {
    ...cdpTeam,
    ...{
      isComplete: {
        ...(cdpTeam.isComplete ? cdpTeam.isComplete : {}),
        [step]: true
      }
    }
  })

  await yar.commit(h)
}

export { setStepComplete }
