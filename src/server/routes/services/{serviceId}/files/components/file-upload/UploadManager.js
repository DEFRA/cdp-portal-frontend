import { formatISO9075 } from 'date-fns'

const ONE_HUNDRED_MEGABYTES = 100 * 1024 * 1024

export default class UploadManager extends EventTarget {
  #files

  startUpload(service, path, files, csrfToken) {
    this.#files = files

    for (const file of this.#files) {
      if (file.size > ONE_HUNDRED_MEGABYTES) {
        this.#uploadLargeFile(service, path, file, csrfToken)
      } else {
        this.#uploadFile(service, path, file, csrfToken)
      }
    }
  }

  getFilesMeta() {
    return Array.from(this.#files).map(({ name, size, status }) => ({
      name,
      size,
      status
    }))
  }

  async #uploadFile(service, path, file, csrfToken) {
    // TODO: Define an actual model
    try {
      file.status = 'uploading'
      file.bytesUploaded = 0
      file.progress = 0

      const url = await this.#getPutUrl(service, path, file, csrfToken)

      const uploadManager = this
      const progressTrackingStream = new TransformStream({
        transform(chunk, controller) {
          controller.enqueue(chunk)
          file.bytesUploaded += chunk.byteLength
          file.progress = Math.round((file.bytesUploaded / file.size) * 100)

          uploadManager.#dispatchFileEvent('progress', file)
        }
      })

      const uploadResponse = await this.#streamBlob(
        url,
        file,
        progressTrackingStream
      )

      if (!uploadResponse.ok) {
        throw new Error('Upload failed')
      }

      file.status = 'complete'
      file.progress = 100
      this.#dispatchFileEvent('complete', file)
    } catch (error) {
      file.status = 'failed'
      this.#dispatchFileEvent('failed', file)
    }
  }

  async #uploadLargeFile(service, path, file, csrfToken) {
    try {
      file.status = 'uploading'
      file.bytesUploaded = 0
      file.progress = 0
      file.uploadParts = []
      file.uploadId = await this.#startMultipartUpload(
        service,
        path,
        file,
        csrfToken
      )

      let currentPosition = 0
      while (currentPosition < file.size) {
        const endPosition = Math.min(
          currentPosition + ONE_HUNDRED_MEGABYTES,
          file.size
        )
        const blob = file.slice(currentPosition, endPosition)
        file.uploadParts.push({ blob })

        currentPosition += ONE_HUNDRED_MEGABYTES
      }

      await Promise.all(
        file.uploadParts.map(async (uploadPart, index) => {
          uploadPart.partNumber = index + 1
          uploadPart.url = await this.#getPutUrl(
            service,
            path,
            file,
            csrfToken,
            uploadPart.partNumber
          )

          const uploadManager = this
          const progressTrackingStream = new TransformStream({
            transform(chunk, controller) {
              controller.enqueue(chunk)
              file.bytesUploaded += chunk.byteLength
              file.progress = Math.round((file.bytesUploaded / file.size) * 100)

              uploadManager.#dispatchFileEvent('progress', file)
            }
          })

          const uploadResponse = await this.#streamBlob(
            uploadPart.url,
            uploadPart.blob,
            progressTrackingStream
          )

          if (!uploadResponse.ok) {
            throw new Error('part upload failed')
          }

          uploadPart.eTag = uploadResponse.ETag
        })
      )

      await this.#completeMultipartUpload(service, path, file, csrfToken)

      file.status = 'complete'
      file.progress = 100
      this.#dispatchFileEvent('complete', file)
    } catch (error) {
      file.status = 'failed'
      this.#dispatchFileEvent('failed', file)
    }
  }

  #dispatchFileEvent(type, file) {
    this.dispatchEvent(
      new CustomEvent(type, {
        detail: {
          name: file.name,
          size: file.size,
          bytesUploaded: file.bytesUploaded,
          status: file.status,
          progress: file.progress,
          uploadId: file.uploadId
        }
      })
    )
  }

  async #getPutUrl(service, path, file, csrfToken, uploadPartNumber) {
    const response = await fetch(`/services/${service}/files-api/put-url`, {
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
        path: `${path}/${file.name}`,
        uploadId: file.uploadId,
        uploadPartNumber
      })
    })

    if (!response.ok) {
      throw new Error('Failed to get PUT URL')
    }

    const { url } = await response.json()

    return url
  }

  async #streamBlob(url, blob, progressTrackingStream) {
    const uploadResponse = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/octet-stream'
      },
      body: blob.stream().pipeThrough(progressTrackingStream),
      duplex: 'half'
    })

    return uploadResponse
  }

  async #startMultipartUpload(service, path, file, csrfToken) {
    const response = await fetch(
      `/services/${service}/files-api/multipart-upload`,
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
          path: `${path}/${file.name}`
        })
      }
    )

    if (!response.ok) {
      throw new Error('Failed to start multipart upload')
    }

    const { uploadId } = await response.json()

    return uploadId
  }

  async #completeMultipartUpload(service, path, file, csrfToken) {
    const response = await fetch(
      `/services/${service}/files-api/multipart-upload/${file.uploadId}`,
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
          path: `${path}/${file.name}`,
          uploadParts: file.uploadParts.map((part, index) => ({
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
