import htmx from 'htmx.org'
import 'htmx.org/dist/ext/hx-head.js'

htmx.config.history = 'reload'
htmx.config.requestClass = 'app-loader--is-loading'

// Reload page on auth error
htmx.on('htmx:response:error', (event) => {
  const statusCode = event.detail?.ctx?.response?.status
  if (statusCode === 401 || statusCode === 404) {
    window.location.reload(true)
  }
})

// Re-init GDS and CDP Modules
htmx.on('htmx:after:process', (event) => {
  if (event.target !== document.body) {
    window.cdp.initAll(event.target)
  }
})
