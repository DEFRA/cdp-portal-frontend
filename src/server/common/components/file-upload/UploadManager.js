import pRetry, { AbortError } from 'p-retry'
import SparkMD5 from 'spark-md5'

const HASH_CHUNK_SIZE = 2 * 1024 * 1024 // Chunks of 2MB

export default class UploadManager extends EventTarget {
  #uploads = []

  startUpload(service, path, files, csrfToken) {
    for (const file of files) {
      this.#uploadFile(service, path, file, csrfToken)
    }
  }

  getUploads() {
    return this.#uploads.map(({ file, uploadParts, ...data }) => data)
  }

  async #uploadFile(service, path, file, csrfToken) {
    const upload = {
      file,
      uploadParts: [],
      name: file.name,
      status: 'uploading',
      uploadId: '',
      size: file.size,
      bytesUploaded: 0,
      progress: 0
    }
    this.#uploads.push(upload)

    try {
      const uploadResponse = await this.#startMultipartUpload(
        service,
        path,
        upload,
        csrfToken
      )

      upload.uploadId = uploadResponse.uploadId

      for (const part of uploadResponse.parts) {
        const blob = file.slice(part.byteStartPosition, part.byteEndPosition)
        upload.uploadParts.push({
          partNumber: part.partNumber,
          url: `/services/${service}/imports-resource/${encodedResourcePath(path, upload.name)}?${part.queryParams}`,
          blob,
          bytesUploaded: 0
        })
      }

      await Promise.all(
        upload.uploadParts.map(async (uploadPart) => {
          uploadPart.contentMd5 = await calcMd5Hash(uploadPart.blob)

          const uploadManager = this

          const uploadResponse = await this.#streamBlob(
            uploadPart.url,
            uploadPart.blob,
            uploadPart.contentMd5,
            csrfToken,
            ({ bytesUploaded }) => {
              uploadPart.bytesUploaded = bytesUploaded
              upload.bytesUploaded = upload.uploadParts.reduce(
                (sum, part) => sum + part.bytesUploaded,
                0
              )

              upload.progress = Math.round(
                (upload.bytesUploaded / upload.size) * 100
              )

              uploadManager.#dispatchFileEvent('progress', upload)
            }
          )

          if (!uploadResponse.ok) {
            throw new Error('part upload failed')
          }

          uploadPart.eTag = uploadResponse.headers.get('etag')
        })
      )

      await this.#completeMultipartUpload(service, path, upload, csrfToken)

      upload.status = 'complete'
      upload.progress = 100
      this.#dispatchFileEvent('complete', upload)
    } catch (error) {
      upload.status = 'failed'
      this.#dispatchFileEvent('failed', upload)
    }
  }

  #dispatchFileEvent(type, upload) {
    const { file, uploadParts, ...data } = upload
    this.dispatchEvent(
      new CustomEvent(type, {
        detail: data
      })
    )
  }

  async #streamBlob(url, blob, md5Hash, csrfToken, onProgress) {
    const uploadResponse = await xmlHttpRequestWithUploadProgressWithRetry(
      `${url}&contentMd5=${encodeURIComponent(md5Hash)}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/octet-stream',
          'Cache-Control': 'no-cache, no-store, max-age=0',
          Expires: 'Thu, 1 Jan 1970 00:00:00 GMT',
          Pragma: 'no-cache',
          'X-CSRF-Token': csrfToken
        },
        body: blob
      },
      onProgress
    )

    return uploadResponse
  }

  async #startMultipartUpload(service, path, upload, csrfToken) {
    const response = await fetchWithRetry(
      `/services/${service}/imports-resource/${encodedResourcePath(path, upload.name)}`,
      {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Cache-Control': 'no-cache, no-store, max-age=0',
          Expires: 'Thu, 1 Jan 1970 00:00:00 GMT',
          Pragma: 'no-cache',
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify({
          size: upload.size
        })
      }
    )

    if (!response.ok) {
      throw new Error('Failed to start multipart upload')
    }

    const result = await response.json()

    return result
  }

  async #completeMultipartUpload(service, path, upload, csrfToken) {
    const response = await fetchWithRetry(
      `/services/${service}/imports-resource/${encodedResourcePath(path, upload.name)}?uploadId=${upload.uploadId}`,
      {
        method: 'PUT',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Cache-Control': 'no-cache, no-store, max-age=0',
          Expires: 'Thu, 1 Jan 1970 00:00:00 GMT',
          Pragma: 'no-cache',
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify({
          uploadParts: upload.uploadParts.map((part) => ({
            eTag: part.eTag,
            partNumber: part.partNumber
          }))
        })
      }
    )

    if (!response.ok) {
      throw new Error('Failed to complete multipart upload')
    }

    const { uploadId } = await response.json()

    return uploadId
  }
}

function fetchWithRetry(url, fetchOpts, retryOpts = {}) {
  return pRetry(
    async () => {
      const response = await fetch(url, fetchOpts)

      if (response.status === 404) {
        throw new AbortError(`${response.status}:${response.statusText}`)
      }

      if (!response.ok) {
        throw new Error(`${response.status}:${response.statusText}`)
      }

      return response
    },
    { retries: 2, minTimeout: 500, ...retryOpts }
  )
}

// API approximates fetch API
// xmlHttpRequest is used over fetch to get cross-browser support for upload progress
function xmlHttpRequestWithUploadProgress(url, options = {}, onProgress) {
  const xhr = new XMLHttpRequest()
  return new Promise((resolve, reject) => {
    xhr.addEventListener('error', (event) => {
      return reject(event)
    })

    xhr.addEventListener('abort', (event) => {
      return reject(event)
    })

    xhr.addEventListener('load', () => {
      resolve({
        ok: xhr.status >= 200 && xhr.status <= 299,
        status: xhr.status,
        statusText: xhr.statusText,
        body: xhr.response,
        headers: new Headers({
          eTag: xhr.getResponseHeader('eTag')
        })
      })
    })

    xhr.upload.addEventListener('progress', (event) => {
      onProgress?.({ bytesUploaded: event.loaded })
    })

    xhr.open(options.method ?? 'GET', url, true)

    Object.entries(options.headers ?? {}).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value)
    })

    xhr.send(options.body)
  })
}

function xmlHttpRequestWithUploadProgressWithRetry(
  url,
  options,
  onProgress,
  retryOpts = {}
) {
  return pRetry(
    async () => {
      onProgress({ bytesUploaded: 0 })
      const response = await xmlHttpRequestWithUploadProgress(
        url,
        options,
        onProgress
      )

      if (response.status === 404) {
        throw new AbortError(`${response.status}:${response.statusText}`)
      }

      if (!response.ok) {
        throw new Error(`${response.status}:${response.statusText}`)
      }

      return response
    },
    { retries: 2, minTimeout: 500, ...retryOpts }
  )
}

function encodedResourcePath(path, filename) {
  if (!path) return encodeURIComponent(filename)

  if (path && filename) return `${path}/${encodeURIComponent(filename)}`
}

async function calcMd5Hash(blob) {
  return new Promise((resolve, reject) => {
    const md5 = new SparkMD5.ArrayBuffer()
    const numberOfChunks = Math.ceil(blob.size / HASH_CHUNK_SIZE)
    const fileReader = new FileReader()
    let currentChunk = 0

    fileReader.onerror = (error) => {
      reject(error)
    }

    fileReader.onload = (event) => {
      md5.append(event.target.result)
      currentChunk++

      if (currentChunk < numberOfChunks) {
        loadNext()
      } else {
        const hash = btoa(md5.end(true)) // Base64 encoded
        md5.destroy()
        resolve(hash)
      }
    }

    function loadNext() {
      const start = currentChunk * HASH_CHUNK_SIZE
      const end =
        start + HASH_CHUNK_SIZE >= blob.size
          ? blob.size
          : start + HASH_CHUNK_SIZE

      fileReader.readAsArrayBuffer(blob.slice(start, end))
    }

    loadNext()
  })
}
