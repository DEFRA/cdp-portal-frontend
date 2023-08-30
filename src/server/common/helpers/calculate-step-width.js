function calculateStepWidth(isComplete) {
  const totalSteps = Object.keys(isComplete).length
  const completeStepCount = Object.values(isComplete).filter(Boolean).length

  if (completeStepCount === totalSteps) {
    return 100
  }

  return (100 / (totalSteps - 1)) * completeStepCount
}

export { calculateStepWidth }
