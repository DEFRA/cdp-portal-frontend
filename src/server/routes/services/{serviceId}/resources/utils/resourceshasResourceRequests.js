export default function resourcesHasResourceRequests(resources) {
  const hasResourceRequest = Object.entries(resources ?? {})
    .map(([_, def]) => Object.entries(def).map(([_, res]) => res))
    .flat(2)
    .some((res) => res.resourceRequestId)

  return hasResourceRequest
}
