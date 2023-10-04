import { sessionNames } from '~/src/server/common/constants/session-names'

async function setStepComplete({ yar }, h, step) {
  const key = sessionNames.deployment
  const deployment = yar.get(key)

  yar.set(key, {
    ...deployment,
    ...{
      isComplete: {
        ...(deployment.isComplete ? deployment.isComplete : {}),
        [step]: true
      }
    }
  })

  await yar.commit(h)
}

export { setStepComplete }
