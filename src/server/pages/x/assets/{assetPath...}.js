import { s3FileHandler } from '#server/documentation/helpers/s3-file-handler.js'
import { config } from '#config/config.js'

const bucket = config.get('documentation.bucket')

export async function GET(request, h) {
  const assetPath = request.params.assetPath

  return await s3FileHandler(request, h, `assets/${assetPath}`, bucket)
}
