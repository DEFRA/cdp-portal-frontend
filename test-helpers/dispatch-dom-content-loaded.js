const dispatchDomContentLoaded = () => {
  window.document.dispatchEvent(
    new Event('DOMContentLoaded', {
      bubbles: true,
      cancelable: true
    })
  )
}

export { dispatchDomContentLoaded }
