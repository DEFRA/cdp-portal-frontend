import { config } from '~/src/config/config.js'

const selfServiceOpsUrl = config.get('selfServiceOpsUrl')

export async function scaleEcsToZero(request, serviceName) {
  const endpoint = `${selfServiceOpsUrl}/scale-to-zero/${serviceName}`

  const { data, response } = await request.authedFetcher(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  })

  return { data, response }
}
