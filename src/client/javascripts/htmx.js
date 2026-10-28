import htmx from 'htmx.org'

htmx.config.history = 'reload'
// htmx.config.defaultSwap = 'innerMorph'
htmx.config.noSwap = [204, 304, 403, 404]
