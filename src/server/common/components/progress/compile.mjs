import nunjucks from 'nunjucks'
import fs from 'node:fs/promises'
import { randomUUID } from 'node:crypto'


const template = await fs.readFile('./template.njk', { encoding: 'utf-8'})
const templateName = randomUUID();

const compiled = nunjucks.precompileString(template, {
  name: templateName
})

await fs.writeFile('./template.js', `${compiled}
  export default '${templateName}';
`)
