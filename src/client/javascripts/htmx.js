import htmx from 'htmx.org'
import 'htmx.org/dist/ext/hx-head.js'

htmx.config.history = 'reload'

// Reload page on error
htmx.on('htmx:response:error', () => window.location.reload(true))
htmx.on('htmx:error', () => window.location.reload(true))
