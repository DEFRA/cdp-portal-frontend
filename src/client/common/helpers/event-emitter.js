function subscribe(name, listener) {
  document.addEventListener(name, listener)
}

function unsubscribe(name, listener) {
  document.removeEventListener(name, listener)
}

function publish(name, data = {}) {
  const event = new CustomEvent(name, { detail: data })

  document.dispatchEvent(event)
}

export { publish, subscribe, unsubscribe }
