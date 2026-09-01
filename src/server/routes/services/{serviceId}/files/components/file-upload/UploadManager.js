export default class UploadManager extends EventTarget {
  #files

  startUpload(service, path, files, csrfToken) {
    this.#files = files

    for (const file of this.#files) {
      this.#uploadFile(service, path, file, csrfToken)
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
    try {
      file.status = file.status ?? 'uploading'
      file.bytesUploaded = file.bytesUploaded ?? 0
      file.progress = file.progress ?? 0

      const urlRequest = await fetch(`/services/${service}/files-api/put-url`, {
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
      })

      if (!urlRequest.ok) {
        throw new Error('Url fetch failed')
      }

      const { url } = await urlRequest.json()

      const uploadManager = this
      const progressTrackingStream = new TransformStream({
        transform(chunk, controller) {
          controller.enqueue(chunk)
          file.bytesUploaded += chunk.byteLength
          file.progress = Math.round((file.bytesUploaded / file.size) * 100)

          uploadManager.dispatchEvent(
            new CustomEvent('progress', {
              detail: {
                name: file.name,
                size: file.size,
                bytesUploaded: file.bytesUploaded,
                progress: file.progress,
                status: file.status
              }
            })
          )
        }
      })

      const uploadResponse = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/octet-stream'
        },
        body: file.stream().pipeThrough(progressTrackingStream),
        duplex: 'half'
      })

      if (!uploadResponse.ok) {
        throw new Error('Upload failed')
      }

      file.status = 'complete'
      file.progress = 100

      this.dispatchEvent(
        new CustomEvent('complete', {
          detail: {
            name: file.name,
            size: file.size,
            bytesUploaded: file.size,
            status: file.status,
            progress: file.progress
          }
        })
      )
    } catch (error) {
      file.status = 'failed'

      this.dispatchEvent(
        new CustomEvent('failed', {
          detail: {
            name: file.name,
            size: file.size,
            bytesUploaded: file.size,
            status: file.status,
            progress: file.progress
          }
        })
      )
    }
  }

  async #uploadLargeFile(service, path, file, csrfToken) {
    // TODO: over a certain size, split the upload into parallel streams
  }
}
