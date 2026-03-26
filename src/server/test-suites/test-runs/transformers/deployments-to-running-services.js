import { buildLink } from '#server/common/helpers/view/build-link.js'
import { noValue } from '#server/common/constants/no-value.js'
import { renderComponent } from '#server/common/helpers/nunjucks/render-component.js'
import { getIcon } from '#server/deployments/transformers/deployment-to-summary.js'

export function transformDeploymentToRunningServices(deployments) {
  const rows = deployments.data
    .filter((item) => item?.deployment)
    .sort((a, b) => b.created - a.created)
    .map(({ deployment }) => {
      const {
        service,
        version,
        cpu,
        memory,
        instanceCount,
        created,
        updated,
        cdpDeploymentId,
        environment,
        status,
        unstable,
        user
      } = deployment

      const icon = getIcon(
        status,
        unstable,
        'app-icon--small govuk-!-margin-left-1'
      )

      const tooltipInfo = `
        <span class="app-tool-tip__content">
          <div class="app-tool-tip__list">
            ${[
              ['Instances', instanceCount],
              ['CPU', (cpu / 1024).toFixed(1)],
              ['Memory', (memory / 1024).toFixed(1) + ' GB'],
              ['User', user.displayName]
            ]
              .map(
                ([k, v]) => `
              <span class="app-tool-tip__key">${k}:</span>
              <span class="app-tool-tip__value">${v}</span>
            `
              )
              .join('')}
          </div>
        </span>
      `

      return [
        {
          html: `
            <div class="app-!-layout-centered">
              ${buildLink({ href: `/deployments/${environment}/${cdpDeploymentId}`, text: service })}
              ${renderComponent('tool-tip', { tooltip_html: tooltipInfo }, [icon])}
            </div>
          `
        },
        {
          html: version
            ? buildLink({
                href: `https://github.com/DEFRA/${service}/releases/tag/${version}`,
                text: version
              })
            : noValue
        },
        {
          html: created
            ? renderComponent('time', { datetime: created })
            : noValue
        },
        {
          html:
            updated && updated !== created
              ? renderComponent('time', { datetime: updated })
              : noValue
        }
      ]
    })

  return {
    classes: 'app-running-services-list govuk-!-margin-bottom-0',
    attributes: { 'data-testid': 'govuk-running-services-list' },
    rows
  }
}
