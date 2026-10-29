import htmx from 'htmx.org'
import 'htmx.org/dist/ext/hx-head.js'

htmx.config.history = 'reload'

// Reload page on error
// htmx.on('htmx:response:error', () => window.location.reload(true))
// htmx.on('htmx:error', () => window.location.reload(true))

// Re-init GDS and CDP Modules
htmx.on('htmx:after:process', (event) => window.cdp.initAll(event.target))
