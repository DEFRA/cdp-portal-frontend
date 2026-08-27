export default class UploadManager {
  startUpload(files) {
    setInterval(() => {
      for (const file of files) {
        file.bytesDownloaded = file.bytesDownloaded ?? 0
        file.bytesDownloaded += 100

        if (file.bytesDownloaded >= file.size) continue

        const progress = Math.round((file.bytesDownloaded / file.size) * 100)

        const $progress = document.getElementById(
          `upload-progress-${file.name}`
        )

        if ($progress) {
          $progress.setAttribute('data-progress', progress)
          $progress.setAttribute('data-complete', file.bytesDownloaded)
        }
      }
    }, 10)
  }
}
