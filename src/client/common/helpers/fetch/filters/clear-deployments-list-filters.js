async function clearDeploymentsListFilters(event) {
  event.preventDefault()

  const queryParams = new URLSearchParams(window.location.search)

  queryParams.delete('service')
  queryParams.delete('user')
  queryParams.delete('status')

  window.location.search = queryParams.toString()
}

export { clearDeploymentsListFilters }
