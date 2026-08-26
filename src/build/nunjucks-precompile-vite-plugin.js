import nunjucks from 'nunjucks'

export default function nunjucksPrecompile() {
  return {
    name: 'nunjucks-precompile',
    transform: {
      filter: {
        id: /\.(njk)$/
      },
      handler(src, id) {
        const compiled = nunjucks.precompileString(src, {
          name: id
        })

        return {
          code: `${compiled}
            export default '${id}';
          `,
          map: null
        }
      }
    }
  }
}
