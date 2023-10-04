import { sessionNames } from '~/src/server/common/constants/session-names'

async function setStepComplete({ yar }, h, step) {
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

  await yar.commit(h)
}

export { setStepComplete }
