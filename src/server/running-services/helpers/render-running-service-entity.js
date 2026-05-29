import { nunjucksEnvironment } from '#config/nunjucks/index.js'

const runningServiceEntityTemplate = nunjucksEnvironment.getTemplate(
  'running-service-entity/template.njk',
  true
)

function renderRunningServiceEntity(params) {
  return runningServiceEntityTemplate.render({ params })
}

export { renderRunningServiceEntity }
