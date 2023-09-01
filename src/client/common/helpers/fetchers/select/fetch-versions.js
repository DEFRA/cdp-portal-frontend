async function fetchVersions(value) {
  const response = await fetch(
    `${location.origin}/cdp-portal-frontend/deploy-service/available-versions?serviceName=${value}`
  )
  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw new Error(json.message)
}

export { fetchVersions }
