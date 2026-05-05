import mermaid from 'mermaid'
import svgPanZoom from 'svg-pan-zoom'

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
        const service = module.icons.icons['aws-fargate']

        return {
          ...module.icons,
          icons: {
            ...module.icons.icons,
            'aws-fargate-frontend': {
              ...service,
              body:
                service.body.replace(
                  'path fill="#fff"',
                  'path fill="#fff" transform="translate(0, -32)"'
                ) +
                '<text x="75" y="236" font-size="60" font-family="Courier New" font-weight="bold" fill="#FFF">&lt;/&gt;</text>'
            },
            'aws-fargate-backend': {
              ...service,
              body:
                service.body.replace(
                  'path fill="#fff"',
                  'path fill="#fff" transform="translate(0, -32)"'
                ) +
                '<text x="95" y="236" font-size="60" font-family="Courier New" font-weight="bold" fill="#FFF">{}</text>'
            }
          }
        }
      })
  }
])

async function run() {
  await mermaid.run()

  document.querySelectorAll('pre.mermaid--pan-zoom > svg').forEach((svg) => {
    const height = svg.getAttribute('viewBox').split(' ')[3]
    const { width } = svg.parentElement.getBoundingClientRect()

    svgPanZoom(svg, {
      controlIconsEnabled: false,
      mouseWheelZoomEnabled: true
    })

    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
    svg.style.maxWidth = width
  })
}
run()
