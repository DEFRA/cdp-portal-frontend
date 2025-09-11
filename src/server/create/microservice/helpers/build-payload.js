/**
 * Builds payload for self-service-ops to create a microservice
 * @param {{}} serviceTemplates
 * @param {{}} create
 * @returns {{teamId: string, templateTag: string, repositoryName: string, serviceTypeTemplate: string}}
 */
function buildPayload({ serviceTemplates, create }) {
  const { defaultBranch, id: serviceTypeTemplate } = serviceTemplates.find(
    (o) => o.id === create.serviceTypeTemplateId
  )

  const repositoryName = create.microserviceName
  const teamId = create.teamId
  const templateTag =
    !create.templateTag && defaultBranch ? defaultBranch : create.templateTag

  return {
    repositoryName,
    serviceTypeTemplate,
    teamId,
    templateTag
  }
}

export { buildPayload }
