import { sessionNames } from '~/src/server/common/constants/session-names'

async function setStepComplete({ yar }, h, step) {
  const key = sessionNames.cdpTeam
  const cdpTeam = yar.get(key)

  yar.set(key, {
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
