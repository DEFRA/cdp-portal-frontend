import { sessionNames } from '~/src/server/common/constants/session-names.js'

async function setStepComplete(
  { yar },
  h,
  step,
  create = yar.get(sessionNames.create)
) {
  yar.set(sessionNames.create, {
    ...create,
    ...{
      isComplete: {
        ...(create.isComplete ? create.isComplete : {}),
        [step]: true
      }
    }
  })

  await yar.commit(h)
}

export { setStepComplete }
