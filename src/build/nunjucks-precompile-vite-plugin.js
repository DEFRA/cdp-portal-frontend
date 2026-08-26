import nunjucks from 'nunjucks'
import { resolve, relative } from 'node:path'

export default function nunjucksPrecompile({ env, paths }) {
  const absolutePaths = paths.map((path) =>
    resolve(import.meta.dirname, '..', '..', path)
  )

  return {
    name: 'nunjucks-precompile',
    transform: {
      filter: {
        id: /\.(njk)$/
      },
      handler(src, id) {
        const pathMatch = absolutePaths.find((path) => id.includes(path))
        const relativeId = pathMatch ? relative(pathMatch, id) : id

        const compiled = nunjucks.precompileString(src, {
          env,
          name: relativeId
        })

        return {
          code: `${compiled}
            export default '${relativeId}';
          `,
          map: null
        }
      }
    }
  }
}
