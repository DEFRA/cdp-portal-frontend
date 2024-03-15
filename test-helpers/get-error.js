class NoErrorThrownError extends Error {}

function errorNoThrown() {
  throw new NoErrorThrownError()
}

async function getError(method) {
  try {
    await method()

    errorNoThrown()
  } catch (error) {
    return error
  }
}

function getErrorSync(method) {
  try {
    method()

    errorNoThrown()
  } catch (error) {
    return error
  }
}

export { getError, getErrorSync, NoErrorThrownError }
