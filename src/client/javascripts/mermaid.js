import mermaid from 'mermaid'
import svgPanZoom from 'svg-pan-zoom'

window.noop = () => {} // Used when defining tooltips

mermaid.initialize({
  startOnLoad: false,
  logLevel: 'error',
  securityLevel: 'loose',
  theme: 'base',
  themeVariables: {
    lineColor: '#0b0c0c',
    primaryColor: '#bbd4e6',
    primaryTextColor: '#0b0c0c',
    primaryBorderColor: '#d2e2f1',
    secondaryColor: '#F5F5F5',
    secondaryBorderColor: '#d2e2f1',
    tertiaryColor: '#f4f8fb',
    tertiaryBorderColor: '#d2e2f1'
  }
})

mermaid.registerIconPacks([
  {
    name: 'logos',
    loader: () =>
      import('@iconify-json/logos').then((module) => {
        const iconsWithTooltip = Object.fromEntries(
          Object.entries(module.icons.icons).map(([name, icon]) => {
            if (name.startsWith('aws-')) {
              return [
                name,
                {
                  body: `${icon.body}<title>${name.replace('aws-', '').toUpperCase()}</title>`
                }
              ]
            }

            return [name, icon]
          })
        )

        return {
          ...module.icons,
          icons: iconsWithTooltip
        }
      })
  }
])

async function run() {
  await mermaid.run()

  document.querySelectorAll('pre.mermaid').forEach((pre) => {
    pre.setAttribute('style', 'visibility: visible;')
  })

  document.querySelectorAll('pre.mermaid--pan-zoom > svg').forEach((svg) => {
    const [, , , height] = svg.getAttribute('viewBox').split(' ')
    const { width } = svg.parentElement.getBoundingClientRect()

    svgPanZoom(svg, {
      controlIconsEnabled: false,
      mouseWheelZoomEnabled: true
    })

    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
    svg.style.maxWidth = width
  })

  document
    .querySelectorAll('pre.mermaid--icon-tooltips > svg g.icon-shape[title] ')
    .forEach((icon) => {
      const tooltip = icon.getAttribute('title')
      if (tooltip) {
        const title = icon.querySelector('svg title')
        if (title) {
          title.textContent = tooltip
        }
      }
    })

  document
    .querySelectorAll('pre.mermaid a[data-js="open-window"]')
    .forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault()
        window.open(event.target.href)
      })
    })
}
run()
