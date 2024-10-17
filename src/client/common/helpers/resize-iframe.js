function resizeIframe(iframe) {
  iframe.height = iframe.contentWindow.document.body.scrollHeight + 'px'

  window.requestAnimationFrame(() => resizeIframe(iframe))
}

export { resizeIframe }
