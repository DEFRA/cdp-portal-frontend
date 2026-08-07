export default function topologyHasResourceRequests(topology) {
  const hasResourceRequest = topology
    .flatMap((service) => service.resources)
    .some((resource) => resource.resourceRequestId)

  if (hasResourceRequest) {
    return true
  }

  const hasResourceRequestInLink = topology
    .flatMap((service) => service.resources)
    .flatMap((resource) => resource.links)
    .some((link) => link.resourceRequestId)

  return hasResourceRequestInLink
}
