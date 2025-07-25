const dispatchDomContentLoaded = () => {
  document.dispatchEvent(new Event('DOMContentLoaded'))
}

export { dispatchDomContentLoaded }
