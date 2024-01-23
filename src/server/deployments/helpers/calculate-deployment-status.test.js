import { calculateDeploymentStatus } from '~/src/server/deployments/helpers/calculate-deployment-status'
import { deploymentDeployedEventsFixture } from '~/src/__fixtures__/deployment-deployed-events'
import { deploymentPendingEventsFixture } from '~/src/__fixtures__/deployment-pending-events'

describe('#getDeploymentStatusText', () => {
  test('Should provide expected "deployed" deployment status', () => {
    expect(
      calculateDeploymentStatus(Object.values(deploymentDeployedEventsFixture))
    ).toEqual({
      classes: 'govuk-tag--green',
      hasFinished: true,
      text: 'deployed'
    })
  })

  test('Should provide expected "pending" deployment status', () => {
    expect(
      calculateDeploymentStatus(Object.values(deploymentPendingEventsFixture))
    ).toEqual({
      classes: 'govuk-tag--blue',
      hasFinished: false,
      text: 'pending'
    })
  })
})
