async function fetchMemory(value) {
  try {
    const response = await fetch(
      `${location.origin}/cdp-portal-frontend/deploy-service/available-memory?cpu=${value}`
    )

    const memoryOptions = await response.json()

    return memoryOptions
  } catch (error) {
    throw new Error(error)
  }
}

export { fetchMemory }
