async function fetchVersions(value) {
  const response = await fetch(
    `${location.origin}/deploy-service/available-versions?serviceName=${value}`,
    { headers: { 'X-Requested-With': 'XMLHttpRequest' } }
  )
  const json = await response.json()

  if (response?.ok) {
    return json
  }

  throw new Error(json.message)
}

export { fetchVersions }
