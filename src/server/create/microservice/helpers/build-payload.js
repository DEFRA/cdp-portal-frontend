/**
 * Builds payload for self-service-ops to create a microservice
 * @param {array<{id: string, defaultBranch?: string}>} serviceTemplates - List of service templates
 * @param {{microserviceName: string, serviceTypeTemplateId: string, teamId: string, templateTag?: string}} create - Microservice creation details
 * @returns {{teamId: string, templateTag: string, repositoryName: string, serviceTypeTemplate: string}}
 */
function buildPayload({ serviceTemplates, create }) {
  const matchingTemplate = serviceTemplates.find(
    ({ id }) => id === create.serviceTypeTemplateId
  )
  const { microserviceName: repositoryName, teamId } = create
  const templateTag = create?.templateTag || matchingTemplate?.defaultBranch
  const serviceTypeTemplate = matchingTemplate?.id

  return {
    repositoryName,
    serviceTypeTemplate,
    teamId,
    templateTag
  }
}

export { buildPayload }
