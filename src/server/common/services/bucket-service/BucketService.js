import { config } from '#config/config.js'
import { encodePathSegments } from './encodePathSegments.js'

export async function listPathContents(request, basePath, path) {
  try {
    const s3Path = formatAsS3Path(path, true)

    const endpoint = `${config.get('portalBackendUrl')}${basePath}${s3Path}`
    const { payload = {} } = await request.authedFetchJson(endpoint)

    return payload
  } catch (error) {
    request.logger.error(error)
    throw error
  }
}

export async function folderTreeForPath(request, basePath, path) {
  try {
    const s3Path = formatAsS3Path(path, true)

    const endpoint = `${config.get('portalBackendUrl')}${basePath}${s3Path}?view=tree`
    const { payload = {} } = await request.authedFetchJson(endpoint)

    return payload
  } catch (error) {
    request.logger.error(error)
    throw error
  }
}

export async function getFileUrl(request, basePath, path) {
  try {
    const s3Path = formatAsS3Path(path)

    const endpoint = `${config.get('portalBackendUrl')}${basePath}${encodePathSegments(s3Path)}`

    const { payload = {} } = await request.authedFetchJson(endpoint)

    return payload.url
  } catch (error) {
    request.logger.error(error)
    throw error
  }
}

export async function startMultipartUpload(request, basePath, path, size) {
  try {
    const s3Path = formatAsS3Path(path)

    const endpoint = `${config.get('portalBackendUrl')}${basePath}${encodePathSegments(s3Path)}`

    const { payload = {} } = await request.authedFetchJson(endpoint, {
      method: 'POST',
      payload: {
        size
      }
    })

    return payload
  } catch (error) {
    request.logger.error(error)
    throw error
  }
}

export async function getMultipartUploadPartUrl(
  request,
  basePath,
  path,
  uploadId,
  partNumber,
  contentMd5
) {
  const s3Path = formatAsS3Path(path)

  const endpoint = `${config.get('portalBackendUrl')}${basePath}${encodePathSegments(s3Path)}?uploadId=${uploadId}&partNumber=${partNumber}&contentMd5=${encodeURIComponent(contentMd5)}`
  const { payload = {} } = await request.authedFetchJson(endpoint, {
    method: 'PUT'
  })

  return payload.url
}

export async function completeMultipartUpload(
  request,
  basePath,
  path,
  uploadId,
  uploadParts = []
) {
  const s3Path = formatAsS3Path(path)

  const endpoint = `${config.get('portalBackendUrl')}${basePath}${encodePathSegments(s3Path)}`
  await request.authedFetchJson(endpoint, {
    method: 'PUT',
    payload: {
      uploadId,
      parts: uploadParts
    }
  })
}

function formatAsS3Path(path = '', withTrailingSlash) {
  let result = path

  if (path === '') return path

  if (result.startsWith('/')) {
    result = result.slice(1)
  }

  if (withTrailingSlash && !result.endsWith('/')) {
    result = `${result}/`
  }

  return result
}
