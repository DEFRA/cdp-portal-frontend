export default function topologyHasResourceRequests(topology) {
  const hasResourceRequest = topology
    .flatMap((service) => service.resources)
    .flatMap((resource) => resource.resourceRequestID)

  if (hasResourceRequest) {
    return true
  }

  const hasResourceRequestInLink = topology
    .flatMap((service) => service.resources)
    .flatMap((resource) => resource.links)
    .some((link) => link.resourceRequestID)

  return hasResourceRequestInLink
}
