import nunjucks from 'nunjucks'
import { resolve, relative, dirname } from 'node:path'
import fs from 'node:fs'
import esquery from 'esquery'

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

        const ast = this.parse(compiled)
        const importUsages = esquery(
          ast,
          'CallExpression[callee.type="MemberExpression"]:has([object.name="env"][property.name="getTemplate"])'
        )
        const importPaths = importUsages
          .map((usage) => usage.arguments[0].value)
          .filter((path) => path !== undefined)
          .map((path) =>
            path.startsWith('.')
              ? resolve(dirname(id), path)
              : searchPaths(paths, path)
          )

        const importStatements = importPaths.map((path) => `import '${path}';`)

        return {
          code: `
            ${importStatements.join('\n')}
            ${compiled}
            export default '${relativeId}';
          `,
          map: null
        }
      }
    }
  }
}

function searchPaths(paths, path) {
  for (const searchPath of paths) {
    const resolved = resolve(searchPath, path)
    if (fs.existsSync(resolved)) return resolved
  }

  throw new Error(
    `Unable to find template ${path} in paths [${paths.join(',')}]`
  )
}
