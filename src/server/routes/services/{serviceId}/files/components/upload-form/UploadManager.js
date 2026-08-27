
const fileSize = 129456

export default class UploadManager {
  startUpload(files) {
    let progress = 0
    let bytes = 0

    const interval = setInterval(() => {
      bytes += 10
      progress = Math.round((bytes / fileSize) * 100)

      const $progress = document.getElementById(
        'upload-progress-58961_57dc36b325be5001a5710653b34efa1d.jpg'
      )

      $progress.setAttribute('data-progress', progress)
      $progress.setAttribute('data-complete', bytes)


      if (progress >= 100) {
        clearInterval(interval)
      }
    }, 1)
  }
}
