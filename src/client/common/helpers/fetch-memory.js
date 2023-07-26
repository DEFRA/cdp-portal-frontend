async function fetchMemory(value) {
  try {
    const response = await fetch(`available-memory?cpu=${value}`) // TODO sort out absolute paths
    const memoryOptions = await response.json()

    return memoryOptions
  } catch (error) {
    throw new Error(error)
  }
}

export { fetchMemory }
