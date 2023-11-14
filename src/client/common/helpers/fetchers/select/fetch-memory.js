async function fetchMemory(value) {
  const response = await fetch(
    `${location.origin}/deploy-service/available-memory?cpu=${value}`
  )
  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw new Error(json.message)
}

export { fetchMemory }
