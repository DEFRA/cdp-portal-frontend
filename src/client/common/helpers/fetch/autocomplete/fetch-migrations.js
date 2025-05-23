async function fetchMigrations(value) {
  const response = await fetch(
    `${location.origin}/apply-changelog/available-migrations?serviceName=${value}`,
    { headers: { 'X-Requested-With': 'XMLHttpRequest' } }
  )
  const json = await response.json()

  if (response?.ok) {
    return json
  }

  throw new Error(json.message)
}

export { fetchMigrations }
