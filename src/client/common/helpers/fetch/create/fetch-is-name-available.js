async function fetchIsNameAvailable(value) {
  const response = await fetch(
    `${location.origin}/create/is-name-available/${value}`
  )
  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw new Error(json.message)
}

export { fetchIsNameAvailable }
